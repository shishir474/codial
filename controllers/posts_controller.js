const { comment } = require("./comments_controller");

const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.postRender = function(req,res){
    res.end('<h1>rendering your Posts..wait for a moment please!!</h1>')
}

module.exports.postLikes = function(req,res){
    res.end('<h1>Wohoo, your Posts likes are 10,000</h1>')
}

// creating an action to submit the data of the form and save it in database
module.exports.createpost = async function(req,res){

    try {
        // since we're using Post schema we need to import it
    // Here user refers to the person who has posted the content which is req.user._id
         await Post.create({
          content:req.body.content,
          user:req.user._id // NOTE: since we need to mark the user who created the post we didn't wrote directly(like req.body bcoz on doing this user field is not present in the db refer robo 3t 1st post)
         // user is req.user._id
        });
      // console.log('********',newPost);

      // adding a flash message for successfull creation of the post
      req.flash('success', 'post published!');
      return res.redirect('back');

    } catch (error) {
        //console.log('Error',error);
        req.flash('error', error);
        return res.redirect('back');
    }
    
}

// deleting posts

module.exports.destroy = async function(req,res){
  try {
        //  route will be /posts/destroy/id   id => string params
        // finding the post in db using id paramater that is a part of the url before deleting
        // we access string params using req.params
        let post = await Post.findById(req.params.id);
        // post found 
        // authorization part:  Am I authorized to delete the post posted by someone else.. Obviously not. So check whether the user who is deleting the post is the same user who has created the post
        // post.user is an id of the user(until and unless I populate). It returns string id
        // When I'm compairing id's of two objects I need to covert them both in string format
        // Ideally we should be using req.user._id but we're using .id.
        // .id means converting the object id into string
        if (post.user == req.user.id){
                //removepost
                post.remove();

                // deleting comments. For this I need to import comment model
                // deleteMany function deletes all the comments based on some queries passed
                await Comment.deleteMany({post:req.params.id});
                req.flash('success', 'Post and associated comments deleted!');
                return res.redirect('back');

        }else{
            // user doesn't match so cant delete
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
  } catch (error) {
     //console.log('Error',error);
     req.flash('error', error);
     return res.redirect('back');   
  }
}