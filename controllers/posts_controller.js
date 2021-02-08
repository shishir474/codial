const Post = require('../models/post');

module.exports.postRender = function(req,res){
    res.end('<h1>rendering your Posts..wait for a moment please!!</h1>')
}

module.exports.postLikes = function(req,res){
    res.end('<h1>Wohoo, your Posts likes are 10,000</h1>')
}

// creating an action to submit the data of the form and save it in database
module.exports.createpost = function(req,res){

    // since we're using Post schema we need to import it
    // Here user refers to the person who has posted the content which is req.user._id
    Post.create({
        content:req.body.content,
        user:req.user._id // NOTE: since we need to mark the user who created the post we didn't wrote directly(like req.body bcoz on doing this user field is not present in the db refer robo 3t 1st post)
        // user is req.user._id
     },function(err,newPost){
        if (err){
            console.log('error in creating the post');
            return ;
        }
        console.log('********',newPost);
       return res.redirect('back');
    });
}