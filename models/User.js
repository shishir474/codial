const mongoose = require('mongoose');
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
    }
    
},{
    timestamps: true // timestamps allows us to store info regarding created-at and last-modified-at of the object
});

const User = mongoose.model('User',userSchema);
module.exports = User;