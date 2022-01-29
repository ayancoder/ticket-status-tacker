const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require('../../models/User');
const Office = require('../../models/Office')
const auth = require("../../middleware/auth");
const fs = require('fs');
const moment = require('moment');
const logger = require('../../config/winston');

const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png'||
    file.mimetype == 'application/pdf'){
      callback(null, true);
    }else{ 
      callback(new Error("invalid file extension"), false);
    }
  
}
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const userId = req.user.id;

    User.findById(userId).populate("office").then(user => {
      const officeName = user.office.docketPrefix
      const dateStr = moment().format('DD-MM-YYYY');
      const dir = "./uploads/" + officeName + "/" + dateStr;
      logger.info(`dir: ${dir}`)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      callback(null, dir);

    })
  },
  filename: function (req, file, callback) {
    // remove space from file name.
    const fileName = file.originalname.replace(/ /g, '');
    //add time stamp in file name
    const fileNameWithDate = Date.now() + "-" + fileName;
    callback(null, fileNameWithDate);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  fileFilter: fileFilter,
}).array('image'); 

  
router.post("/upload", auth, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      let pdfFilePath = [];
      let imgFilePath = [];
      req.files.forEach((file) => {
        if (file.mimetype == "application/pdf") {
          pdfFilePath.push(file.path);
        } else {
          imgFilePath.push(file.path);
        }
      });
      logger.info('file uploaded successfully');
      return res.status(200)
        .json({
          message: "Image Uploaded Successfully !",
          pdf: pdfFilePath,
          img: imgFilePath,
        });
    }
  });
});


module.exports = router;