const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    // fetching all the posts and displaying it 
      let posts = await Post.find({})
        .sort('-createdAt') // sorting the post i.e latest post comes first
        .populate('user')
        .populate({
        path : 'comments',
        populate : {
        path:'user'
        }
    });
    return res.json(200, {
        message: 'lists of all posts',
        posts: posts
    });
}


module.exports.destroy = async function(req,res){
    try {
          
          let post = await Post.findById(req.params.id);
    
          if (post.user == req.user.id){
          
              post.remove();
    
              await Comment.deleteMany({post:req.params.id});
              
              return res.json(200, {
                  message: 'post and associated comments deleted succesfully'
              });

          }else{

            return res.json(401,{
              message: 'You cannot delete this post'  // unauthorized
            });
          }
       
    } catch (error) {
      return res.json(500, {
          message: 'internal server error'
      });
    }
  }