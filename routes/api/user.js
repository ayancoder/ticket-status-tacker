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
    console.log("get all user");
    if (req.user.role === constants.SUPER_ADMIN_ROLE) {
      const users = await User.find();
      res.json(users);
    } else if (req.user.role === constants.ADMIN_ROLE) {
      const adminUserId = req.user.id;
      const adminUser = await User.findById(adminUserId).select(
        "-password -tickets"
      );
      console.log("get user :", adminUser);
      const officeId = ObjectId(adminUser.office);
      const query = {
        office: officeId,
      };
      console.log("get user query ", query);
      const users = await User.find(query).select("name email phone office");
      res.json(users);
    } else {
      return res.status(400).json({ msg: "only BDO can view all users." });
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
        config.get("jwtSecret"),
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
    } catch (err) {
      console.error(err.message);
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

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (role) userFields.role = role;
    if (officeId) userFields.office = officeId;

    console.log("usr field", userFields);
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
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

 router.delete('/:user_id', auth, async (req, res) => {
  try {
    const userId = req.params.user_id;
    console.log("user id", userId);
    let user = await User.findOneAndRemove({ _id: userId });
    if (user) {
      const officeId = user.office;
      console.log("office id:", officeId);

      await Office.findOneAndUpdate(
        { _id: officeId },
        { $pull: { staffs: user._id } },
        { new: true, setDefaultsOnInsert: true }
      );
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); 
module.exports = router;
