const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


// our url will be of the form    /likes/toggle/?id=abc1233&type=postOrcomment
module.exports.toggleLike = async function(req, res){
    try {
        
        let likeable;
        let deleted = false;
       
        if (req.query.type=='post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id

        });
     

        if (existingLike){
             // like already exists.. so delete the like from the array and and from likes collection
             likeable.likes.pull(existingLike._id);
             likeable.save();
            
             existingLike.remove();
             deleted = true;
            // Like.remove(existingLike);

        }else{
             // create a new like 
             var newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
             });

             likeable.likes.push(newLike._id);
             likeable.save();

        }


        
            req.flash('success', 'Post liked');
            return res.json(200,{
                message: 'request succesfull',
                data: {
                    deleted: deleted
                }
           });
        
            


    } catch (error) {
        // One could either send flash msgs or return json. since we will be performing our likes action via ajax requests we will retunrn json..
        console.log(error);
        return res.json(500,{
            message: 'Internal Server Error'
        });
    }
}