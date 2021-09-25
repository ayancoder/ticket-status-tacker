const express = require("express");
const router = express.Router();
const multer = require("multer");
const { route } = require("./ticket");

const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/jpeg' | 
    file.mimetype === 'image/png'){
      callback(null, true);
    }else{ 
      callback(new Error("invalid file extension"), false);
    }
  
}
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).single('image'); 

  
router.post('/upload', (req, res) => {
  
    upload(req, res, function (err) {
  
        if (err) {
  
            res.status(400).json({message: err.message})
  
        } else {
  
            let path = `/uploads/${req.file.filename}`
            res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
        }
    })
  })


module.exports = router;