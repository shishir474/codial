const mongoose = require('mongoose');

const multer = require('multer');

// ...paths <string> A sequence of path segments
// Returns: <string></string>
//path.join() method joins all given path segments together in order to construct a path
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars'); // AVATAR_PATH specifies where the uploaded file is going to be stored

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    avatar:{  // this field is storing the file location (in string) where my file is stored. DB doesnot store the file it justs stores the file path..for that we defined a field avatar
        type: String
    }
    
},{
    timestamps: true // timestamps allows us to store info regarding created-at and last-modified-at of the object
});



// defining storage properties of multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {  // cb => callback
      cb(null, path.join(__dirname,'..', AVATAR_PATH))   // using path.join to construct the path where my uploaded file is going to be stored
    },
    filename: function (req, file, cb) {  // filename is appended with current timestamp in milliseconds
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

  // static methods:  statics allows us to use this methods globally.. How can I access this simple, modelName.methodName
  userSchema.statics.uploadAvatar = multer({storage: storage}).single('avatar');  // accessing it via : User.uploadAvatar, single means only one single file location can be stored in avatar field, uploadedAvatar is a function
  userSchema.statics.avatarPath = AVATAR_PATH;  // User.avatarPath
  // now this avatarPath is publically available

    const User = mongoose.model('User',userSchema);// model name: User which is using userSchema

    module.exports = User;