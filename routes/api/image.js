const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdf2jpg = require('pdf2jpg');
const User = require('../../models/User');
const Office = require('../../models/Office')
const auth = require("../../middleware/auth");
//const imageConverter = require("../../converter/pdfToImg")
const fs = require('fs');

const fileFilter = (req, file, callback) => {
 console.log("file -->", file)
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
      const dir = "./uploads/" + officeName + "/" + getDate();
      console.log("dir:",dir)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      callback(null, dir);

    })
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const getDate = () => {
  const event = new Date();
  const mon = event.getMonth() + 1;
  const day = event.getDate();
  const year = event.getFullYear();
  const dateStr = day + "-" + mon + "-" + year;
  return dateStr;
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).array('image'); 

  
router.post("/upload", auth, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      //console.log("req", req);
      //let pdfFilePath = [];
      let imgFilePath = [];
      req.files.forEach((file) => {
        if (file.mimetype == "application/pdf") {
          //pdfFilePath.push(file.path);
          convertPdfToImg(file.path);
        } else {
          imgFilePath.push(file.path);
        }
      });
      console.log("files ", imgFilePath );
      res
        .status(200)
        .json({
          message: "Attachment Uploaded Successfully !",
          img: imgFilePath,
        });
    }
  });
});

const convertPdfToImg = (file) => {
  console.log("file", file)
  const source = fs.readFileSync(file); // can be buffer or just url
  pdf2jpg(source).then(buffer => fs.writeFileSync('out.jpg', buffer))
}

module.exports = router;