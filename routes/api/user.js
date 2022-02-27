const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const checkObjectId = require("../../middleware/checkObjectId");
const User = require("../../models/User");
const constants = require('../../const/constants');
const logger = require('../../config/winston');
const { JWT_SECRET } = require("../../config/config");

// @route    GET api/user/details
// @desc     get user details for given user id. only SUPER_ADMIN can execute it.
// @access   Private
router.get("/details", auth, async (req, res) => {
  try {
    if (req.user.role === constants.SUPER_ADMIN_ROLE) {
      const user = await User.findById(req.body.userId).select("name phone email password role");
      res.json(user);
    } else
      if (!user) {
        return res.status(400).json({ msg: "no user found" });
      }
    res.json(user);
  } catch (err) {
    logger.error(err.message);
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
      logger.error(err.message);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route    GET api/user?role=DEALING_OFFICER if in req body any role specified 
//           otherwise all of given office .( office id -> get user id from token
//           get office id of given user. ) 
// @desc     Get all users
// @access   only admin can excute
router.get("/", auth, async (req, res) => {
  try {
    logger.info(`get all user of role: ${JSON.stringify(req.query.role)}`);
    if (req.user.role === constants.SUPER_ADMIN_ROLE) {
      const users = await User.find();
      res.json(users);
    } else if (req.user.role === constants.ADMIN_ROLE) {
      const adminUserId = req.user.id;
      const adminUser = await User.findById(adminUserId).select(
        "-password -tickets"
      );
      const officeId = ObjectId(adminUser.office);
      const query = {};
      if(officeId) query.office = officeId
      if(req.query.role) query.role = req.query.role;
      logger.info(`get user query  ${JSON.stringify(query)}`);
      const users = await User.find(query).select("name email phone office");
      res.json(users);
    } else {
      return res.status(400).json({ msg: "only BDO can view all users." });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  check("name", "Name is required").notEmpty(),
  check("phone", "Mobile no. is required").notEmpty(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, officeId } = req.body;
    logger.info(`user data name:${name}, email:${email}, phone:${phone} ,password:${password},
      officeId:${officeId}`);
    try {
      let user = await User.findOne({ phone });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: "200",
          r: "pg",
          d: "mm",
        }),
        { forceHttps: true }
      );

      user = new User({
        name: name,
        email: email,
        avatar: avatar,
        phone: phone,
        office: officeId,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get(JWT_SECRET),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // add the use to office staff.
      if (officeId) {
        let office = await Office.findOneAndUpdate(
          { _id: officeId },
          { $push: { staffs: user._id } },
          { new: true, setDefaultsOnInsert: true }
        );
      }
      logger.info(`user created ${user}`);

    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    PUT api/users
// @desc     update user
// @access   Private
router.put(
  "/",
  auth,
  check("_id", "userId is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const { _id, name, email, phone, role, officeId } = req.body;
    logger.info(`updating user id:${_id}, name:${name}, 
                 email:${email}, phone:${phone}, 
                 role:${role}, officeId:${officeId}`);

    // Build user object
    var userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (role) userFields.role = role;
    if (officeId) userFields.office = officeId;

    logger.info(`usr field ${JSON.stringify(userFields)}`);
    try {
      let user = await User.findOneAndUpdate(
        { _id: _id },
        { $set: userFields },
        { new: true, setDefaultsOnInsert: true }
      );
      // add the use to office staff.
      let office = await Office.findOneAndUpdate(
        { _id: officeId },
        { $push: { staffs: user._id } },
        { new: true, setDefaultsOnInsert: true }
      );

      return res.json(user);
    } catch (err) {
      logger.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

 router.delete('/:user_id', auth, async (req, res) => {
  try {
    const userId = req.params.user_id;
    logger.info(`user id ${JOSN.stringify(userId)}`);
    let user = await User.findOneAndRemove({ _id: userId });
    if (user) {
      const officeId = user.office;
      logger.info(`office id: ${JSON.stringify(officeId)}`);

      await Office.findOneAndUpdate(
        { _id: officeId },
        { $pull: { staffs: user._id } },
        { new: true, setDefaultsOnInsert: true }
      );
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
}); 
module.exports = router;
