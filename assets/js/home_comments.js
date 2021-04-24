// {
//     // console.log('script loaded')

//     let createComment = function(){
//         let newCommmentForm = $('#new-comment-form');

//         newCommmentForm.submit(function(e){
//             e.preventDefault();

//             $.ajax({
//                 method: 'POST',
//                 url: '/comment/create',
//                 data: newCommmentForm.serialize(),
//                 success: function(resData){
//                     console.log(resData);
//                      let newComment = newCommentDom(resData.data.comment);
//                      $('#post-comments-list > ul').prepend(newComment);
//                      console.log(newComment);
//                      deleteCommentDom($(' .delete-comment-button', newComment))
//                      console.log('comment creation success handler')

//                      // CHANGE :: enable the functionality of the toggle like button on the new post
//                      new ToggleLike($(' .toggle-like-button', newComment));
                     

//                      new Noty({
//                         theme: 'relax',
//                         text: "Comment published!",
//                         type: 'success',
//                         layout: 'topRight',
//                         timeout: 1500
                        
//                     }).show();

//                 },error: function(error){
//                     console.log(error.responseText);
//                 }
//             });

//         });
//     }

//     let  newCommentDom = function(comment){
//        return $(`    
//                  <div id="comment-${comment._id}" style="margin-bottom:8px;"> 
//                         <small>
//                             <a class='delete-comment-button' href="/comment/destroy/${comment._id}">X</a>
//                         </small>
                
//                         <span> ${comment.content} <span>
//                         <br>
//                         <small>
//                             ${ comment.user.name}
//                         </small><br>

//                         <small>
//                             <a class="toggle-like-button" data-likes="0"  href= "/likes/toggle/?id=${comment._id}&type=comment" id="likebtn"> 
//                                 0 Likes
//                             </a>
//                         </small>
//                 </div> `)
//     }


//     let deleteCommentDom = function(deletelink){
//         console.log(deletelink);
//         $(deletelink).click(function(e){
//             console.log('inside delete function')
//             e.preventDefault();
//             console.log('sending ajax req');

//             $.ajax({
//                 method: 'GET',
//                 url: $(deletelink).prop('href'),
//                 success: function(resData){
//                     console.log('in success handler')
//                     console.log(resData);
//                      $(`#comment-${resData.data.comment_id}`).remove();

//                      new Noty({
//                         theme: 'relax',
//                         text: "Comment Deleted",
//                         type: 'success',
//                         layout: 'topRight',
//                         timeout: 1500
                        
//                     }).show();
//                 },
//                 error: function(error){
//                     console.log('in error handler')
//                     console.log(error.responseText);
//                 }
//             });

//         })
//     }

//     createComment();
// }



   






// SOLUTION CODE

// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comment/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // CHANGE :: show the count of zero likes on this comment

        return $(`<li id="comment-${ comment._id }">
                        <p>
                            
                            <small>
                                <a class="delete-comment-button" href="/comment/destroy/${comment._id}">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                            <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                    0 Likes
                                </a>
                            
                            </small>
                        </p>    
                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}