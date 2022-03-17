const express = require("express");
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const moment = require('moment');
const auth = require("../../middleware/auth");
const User = require('../../models/User');
const logger = require('../../config/winston');
const uuid = require("uuid");

const { S3_ACCESS_KEY, S3_SECRECT_ACCESS_KEY, S3_BUCKET_REGION } = require('../../config/config');


const s3Config = new aws.S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRECT_ACCESS_KEY,
  region: S3_BUCKET_REGION,
});


const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype == 'application/pdf') {
    callback(null, true);
  } else {
    callback(new Error("invalid file extension"), false);
  }
}


const multerS3Config = (bucketName) =>  multerS3({
  s3 : s3Config,
  bucket: bucketName,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const userId = req.user.id;
    User.findById(userId).populate("office").then(user => {
      const officeName = user.office.docketPrefix
      const dateStr = moment().format('DD-MM-YYYY');
      const dir = officeName + "/" + dateStr;
      logger.info(`dir: ${dir}`)
      const fullPath = dir + '/' + uuid.v4() + file.originalname; //If you want to save into a folder concat de name of the folder to the path
      cb(null, fullPath)
    })
  },
});

const upload = (bucketName) => multer({
  storage: multerS3Config(bucketName),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
  }
});

  
router.post("/upload", auth, (req, res) => {
  logger.info("calling file upload");
  const uploadFiles = upload("pur-bdo-unique-string-office").array('image'); 

  uploadFiles(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      let pdfFilePath = [];
      let imgFilePath = [];
      req.files.forEach((file) => {
        if (file.mimetype == "application/pdf") {
          pdfFilePath.push(file.location);
        } else {
          imgFilePath.push(file.location);
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