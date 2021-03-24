const mongoose = require('mongoose');
const friendshipSchema = new mongoose.Schema({
    // the user who sent this request
    fromUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' // ref option is what tells Mongoose which model to use during population. Here it is referring to User model
    },
    // the user who accepted this request.. the naming is just to understand otherwise, teh users won't see the difference
    toUser: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true
});

const Friendship = mongoose.model('Friendship',friendshipSchema);
module.exports = Friendship;