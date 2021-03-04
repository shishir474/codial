const comment = require('../models/comment');
const Post = require('../models/post');

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
                        
                        req.flash('success', 'comment posted successfully!');
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
// module.exports.destroy = async function(req,res){
//    try {
//         let comment = await comment.findById(req.params.id);
//         if (comment.user == req.user.id){
//             // one who is seending req to delete is the one who has created that comment
//             // before deleting comment save post id bcoz we also need to remove the comment from that post's comments array as well. So if we delete comment before we'll lose the post id
//             let postId = comment.post;

//             // Now delete comment
//             comment.remove();

//             //now deleting the same comment from post's comments array. For this I need to find the post using postId
//             Post.findByIdAndUpdate(postId , {$pull : {comments : req.params.id}});
//             req.flash('success', 'comment deleted succesfully1');
//             return res.redirect('back');
            
//         }else{
//             req.flash('error', 'you are not authorized to delete this comment');
//             return res.redirect('back');
//         }
//    } catch (error) {
//     //console.log('Error',error);
//      req.flash('error', error);
//     return ;
//    }
// }
module.exports.destroy = function(req, res){
    comment.findById(req.params.id, function(err, comment){
        if (err){
            console.log('Error', err);
            return ;
        }
        // console.log(comment.content);
        // return res.redirect('back');
        if (comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId , {$pull : {comments : req.params.id}}, function(err, post){
                req.flash('success', 'comment deleted!')    
                return res.redirect('back');
           });
      
        }else{
             req.flash('error', 'you are not authorized to delete this comment');
             return res.redirect('back');
         }
    });
}



// module.exports.destroy = async function(req, res){

//     try {
//             let comment = await comment.findById(req.params.id);
//             if (comment.user == req.user.id){
//                 let postId = comment.post;
//                 comment.remove();
//                 let post = await Post.findByIdAndUpdate(postId , {$pull : {comments : req.params.id}});
//                 req.flash('success', 'comment deleted!');
//                 return res.redirect('back');  
        
//             }else{
//                 req.flash('error', 'you are not authorized to delete this comment');
//                 return res.redirect('back');
//             }
//     } catch (error) {
//         req.flash('error', 'error in delteing comment');
//         return res.redirect('back');
//     }
//   }


