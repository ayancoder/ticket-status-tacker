const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');
const User = require('../../models/User');

// @route    GET api/user/me
// @desc     Get current users. token is passed in header. user id fetched from token
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: "no user found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/user/:user_id
// @desc     Get user by user ID.
// @access   Public
router.get(
  "/:user_id",
  checkObjectId("user_id"),
  async ({ params: { user_id } }, res) => {
    try {
      const user = await User.findById(user_id);

      if (!user) return res.status(400).json({ msg: "user not found" });

      return res.json(user);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);


// @route    GET api/user
// @desc     Get all users
// @access   only admin can excute
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "ADMIN") {
      const users = await User.find();
      res.json(users);
    } else {
      return res.status(400).json({ msg: "only admin can view all users." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        password,
        phone
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    PUT api/users
// @desc     update user
// @access   Private
router.put(
  "/",
  auth,
  check('_id', 'id is required').notEmpty(),
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
     // destructure the request
     const { _id ,name, email, phone, role} = req.body;
     let userId;
    if (req.user.role === "ADMIN") {
      // if admin executing. then use body's user id
      userId = _id;
    }
    else {
       // if user executing. then use id as token's id
       userId = req.user.id;
    }
    // Build profile object
    const userFields = {};
    userFields._id = userId;
    if(name) userFields.name = name;
    if(email) userFields.email = email;
    if(phone) userFields.phone = phone;
    if(role) userFields.role = role;
    console.log('usr field',userFields);
    try {
      // Using upsert option (creates new doc if no match is found):
      let user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: userFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(user);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;