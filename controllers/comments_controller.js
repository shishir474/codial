const comment = require('../models/comment');
const Post = require('../models/post');

module.exports.comment = function(req,res){
    res.end('<h1>10000 people commented on your post</h1>')
}

// creating an action to submit the data of the form and save it in database
module.exports.createcomment = function(req,res){
 
    // before creating comment check whether post exists or not
    Post.findById(req.body.post, function(err,post){
        if(err){
            console.log('error in finding the post');
            return; 
        }
        if (post){
            //post exists so create comment

             // since we're using Post schema we need to import it
             // Here user refers to the person who has posted the content which is req.user._id
             comment.create({
                content:req.body.content,
                user:req.user._id, // NOTE: since we need to mark the user who created the post we didn't wrote directly(like req.body bcoz on doing this user field is not present in the db refer robo 3t 1st post)
                // user is req.user._id
                post:req.body.post
                // we've sent the post id as part of the fOrm itself in hidden format
             } ,function(err,newComment){
                    // handle error
                    if (err){
                        console.log('error in creating the comment');
                        return ;
                    }
                    // comment is created. NOw push it to comments array in post, on which comment was made
                    post.comments.push(newComment);
                    //  this wlll automatically place the comment id in the array
                    post.save();
                    
        
                    console.log('********',newComment);
                    res.redirect('/');
            });
   


        }
    });




   
}