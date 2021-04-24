const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' // ref option is what tells Mongoose which model to use during population. Here it is referring to User model
    },
    likeable:{   // likeable holds the objectId(either post or comment) which is been liked
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel' // dynamic referencing
    },
    onModel: {
        type: String,
        required: true,
        enum: ['post', 'Comment']  // enum specifies value could be only either post or comment
    }

},{
    timestamps:true
});

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;