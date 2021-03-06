const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');
const User = require('../../models/User');
const Office = require('../../models/Office')
const logger = require('../../config/winston');

// @route    GET api/office/:office_id
// @desc     Get office by office ID.
// @access   Public
router.get(
  "/:office_id",
  checkObjectId("office_id"),
  async ({ params: { office_id } }, res) => {
    try {
      const office = await Office.findById(office_id);

      if (!office) return res.status(400).json({ msg: "office not found" });

      return res.json(office);
    } catch (err) {
      logger.error(err.message);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);


// @route    GET api/offices
// @desc     Get all offices
// @access   
router.get("/", async (req, res) => {
  try {
      const offices = await Office.find();
      res.json(offices);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    POST api/office
// @desc     Register a office.
// @access   only super admi can create a office.
router.post("/", 
check("docketPrefix", "docket prefix  is required").notEmpty(),
auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.user.role == "SUPER_ADMIN") {
    const { name, docketPrefix, address, email } = req.body;
    try {
      let office = await Office.findOne({ email });

      if (office) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Office already exists" }] });
      }

      office = new Office({
        name: name,
        docketPrefix: docketPrefix,
        address: address,
        email: email,
      });

      await office.save();
      logger.info(`office created ${office}`);
      return res.status(200).send(office);
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    }
  } else {
    logger.error(`office creation failed.only super admin can create office`);
    return res
      .status(400)
      .json({ msg: "only super admin can create a office." });
  }
});

// @route    PUT api/offices
// @desc     update office
// @access   Private
router.put(
  "/",
  auth,
  check('_id', 'office id is required').notEmpty(),
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
     // destructure the request
     const { _id, name, shortName, email } = req.body;
    
    // Build user object
    const userFields = {};
    //userFields._id = userId;
    if(name) userFields.name = name;
    if(shortName) userFields.shortName = shortName;
    if(email) userFields.email = email;
    logger.info(`usr field ${JSON.stringify(userFields)}`);
    try {
      // Using upsert option (creates new doc if no match is found):
      let office = await Office.findOneAndUpdate(
        { _id: _id },
        { $set: userFields },
        { new: true, setDefaultsOnInsert: true }
      );
      return res.json(office);
    } catch (err) {
      logger.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;