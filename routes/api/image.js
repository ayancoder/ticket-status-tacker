const express = require("express");
const router = express.Router();
const multer = require("multer");

/* const fileFilter = (req, file, callback) => {
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
}); */

const upload = multer({
    dest:'images/', 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
  
            return callback(new Error('Only Images are allowed !'), false)
        }
  
        callback(null, true);
    }
  }).single('image')
  
router.post('/upload', (req, res) => {
  
    upload(req, res, function (err) {
  
        if (err) {
  
            res.status(400).json({message: err.message})
  
        } else {
  
            let path = `/images/${req.file.filename}`
            res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
        }
    })
  })

router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
})
module.exports = router;