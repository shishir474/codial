const { comment } = require("./comments_controller");

const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

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
                let post = await Post.create({
                content:req.body.content,
                user:req.user._id // NOTE: since we need to mark the user who created the post we didn't wrote directly(like req.body bcoz on doing this user field is not present in the db refer robo 3t 1st post)
                // user is req.user._id
                });
            //    console.log('********',post);
            

            // populating post before returning it in order to fetch name of the user
             //post = await Post.findById(post._id).populate('user'); // this is populating the entire fields of the user.. but we dont want to return password

           //  post = await post.populate('user', ['name', 'email']).execPopulate();// this will only populate name and email of the user.. this is how we populate multiple fields.. if we want to populate the entire user user post.poulate('user');
            // REFER : https://masteringjs.io/tutorials/mongoose/populate 

            // since we're sending the form data using jquery ajax we need to view this form data in posts_controller
            // checking whether req is ajax req or not.. The type of ajax request is XML hTTP Request(xhr)
            if (req.xhr){
                // ajax request => I need to return some json. we return json with some status(here post is succesfully created so 200)
               
                 post = await post.populate('user', 'name').execPopulate();             // this will populate only the name field of the user and not the entire user
                return res.status(200).json({
                    data:{
                        post: post //this post is the post which is created at line 20.. collecting it in a variable and passing it
                    },
                    message:'Post created!' // we need to include a message while sending json data back
                });  // this json data that we're returning is the one which we're recieving in success handlre function
            }

             // adding a flash message for successfull creation of the post
             req.flash('success', 'post published!');
             return res.redirect('back');

    } catch (error) {
        //console.log('Error',error);
        req.flash('error', error);
        console.log(err);
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
                
                await Like.deleteMany({likeable: post._id, onModel: 'post'});
                await Like.deleteMany({_id: {$in: post.comments}});
                //removepost
                post.remove();

                // deleting comments. For this I need to import comment model
                // deleteMany function deletes all the comments based on some queries passed
                await Comment.deleteMany({post:req.params.id});
              
                
                if (req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id: req.params.id
                        },
                        message: 'Post deleted'
                    })
                }

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