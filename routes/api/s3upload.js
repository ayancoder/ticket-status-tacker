const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const logger = require('../../config/winston');
const { S3_ACCESS_KEY, S3_SECRECT_ACCESS_KEY, S3_BUCKET_REGION } = require('../../config/config');


const s3 = new aws.S3();

aws.config.update({
   accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRECT_ACCESS_KEY,
  region: S3_BUCKET_REGION,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload =(bucketName) => multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

  
router.post("/", auth, (req, res) => {
  logger.info("calling file upload");
  const uploadFiles = upload("pur-bdo-unique-string-office").array('file'); 

  uploadFiles(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      let pdfFilePath = [];
      let imgFilePath = [];
      //console.log("request  ",req);
      //console.log("response  ",res);
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