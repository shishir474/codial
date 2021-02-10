const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' // ref option is what tells Mongoose which model to use during population. Here it is referring to User model
    },
         // include array of ids of all comments in post schema itself
         // We'll be loading comments alongside every post. So in order to fetch the comments of a particular post(from comment collection) we're storing the comment ids in comment array.
         // This would make accessing the comments easy and much faster 
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ]

},{
    timestamps:true
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;