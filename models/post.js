const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' // ref option is what tells Mongoose which model to use during population
    }
},{
    timestamps:true
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;