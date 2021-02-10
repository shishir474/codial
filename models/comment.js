const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    // comment belong to a user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' // ref option is what tells Mongoose which model to use during population. Here it is referring to User model
    },
    // comment belong to a post
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
},{
    timestamps:true
});

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;