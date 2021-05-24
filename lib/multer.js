const multer = require("multer")
const path = require("path");

var storage = multer.memoryStorage()
  
var upload = multer({ storage: storage, fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.jfif') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
} });


module.exports = upload;