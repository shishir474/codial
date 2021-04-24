const comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.comment = function(req,res){
    res.end('<h1>10000 people commented on your post</h1>')
}

// creating an action to submit the data of the form and save it in database
module.exports.createcomment = async function(req,res){

    try {
                    // before creating comment check whether post exists or not
            let post = await Post.findById(req.body.post) 
            if (post){
                //post exists so create comment

                    // since we're using Post schema we need to import it
                    // Here user refers to the person who has posted the content which is req.user._id
                    let newComment = await comment.create({
                        content:req.body.content,
                        user:req.user._id, // NOTE: since we need to mark the user who created the post we didn't wrote directly(like req.body bcoz on doing this user field is not present in the db refer robo 3t 1st post)
                        // user is req.user._id
                        post:req.body.post
                        // we've sent the post id as part of the fOrm itself in hidden format
                    })
            // comment is created. NOw push it to comments array in post, on which comment was made
                        // we're updating the comments array so we also need to save it
                        post.comments.push(newComment);
                        //  this wlll automatically place the comment id in the array
                        post.save();

                        newComment = await newComment.populate('user', 'name email').execPopulate();

                                // SENDING MAIL
                       // commentsMailer.newCommentMail(newComment);
                       let job = queue.create('emails', newComment).save(function(err){    // DELAYED JOBS
                           if (err){
                               console.log('error in sending to the queue', err);
                               return;
                             }

                             console.log('job enqueud', job.id);

                       })

                       
                        if (req.xhr){
                            return res.status(200).json({
                                data: {
                                    comment: newComment
                                },
                                message: 'Comment created succesfully!'
                            });1
                        }
                        
                        req.flash('success', 'Comment Published!');
                        //console.log('********',newComment);
                        res.redirect('/');
                  }
    } catch (error) {
       // console.log('Error',error);
       req.flash('error', error);
        return ;
    }
 
   
    }

//delete comment
// module.exports.destroy = function(req, res){
//     comment.findById(req.params.id, function(err, comment){
//         if (err){
//             console.log('Error', err);
//             return ;
//         }
//         console.log(comment);
//         // return res.redirect('back');
//         if (comment.user == req.user.id){
//                 let postId = comment.post;
//                 comment.remove();
//                 Post.findByIdAndUpdate(postId , {$pull : {comments : req.params.id}}, function(err, post){
//                     req.flash('success', 'comment deleted!')    
//                 // return res.redirect('back');
//                 });
//                 if (req.xhr){
//                     return res.status(200).json({
//                         data:{
//                             comment_id: req.params.id
//                         },
//                         message:'Comment deleted!'
//                     })
//                 }

      
//         }else{
//              req.flash('error', 'you are not authorized to delete this comment');
//              return res.redirect('back');
//          }
//     });
// }



module.exports.destroy = async function(req, res){
    console.log("inside destroy commments controller");

    try {
            console.log('comment found')
            let newComment = await comment.findById(req.params.id);
            
            if (newComment.user == req.user.id){
                    let postId = newComment.post;

                    newComment.remove();

                    let post = Post.findByIdAndUpdate(postId , {$pull : {comments : req.params.id}});

                    // destroy the associated likes for this comment
                    await Like.deleteMany({likeable: newComment._id, onModel: 'comment'})

                      // send the comment id which was deleted back to the views
                    if (req.xhr){
                        return res.status(200).json({
                            data: {
                                comment_id: req.params.id
                            },
                            message: "Comment deleted"
                        });
                    }

                    req.flash('success', 'Comment deleted!');

                    return res.redirect('back');  
        
            }else{
                req.flash('error', 'Unauthorized');
                return res.redirect('back');
            }
    }catch(error) {
        console.log('in catch')
        console.log(error);
        req.flash('error','error in deleting comment');
        return;
    }
  }
