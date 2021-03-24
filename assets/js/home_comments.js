{
    // console.log('script loaded')

    let createComment = function(){
        let newCommmentForm = $('#new-comment-form');

        newCommmentForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                method: 'POST',
                url: '/comment/create',
                data: newCommmentForm.serialize(),
                success: function(resData){
                    console.log(resData);
                     let newComment = newCommentDom(resData.data.comment);
                     $('#post-comments-list > ul').prepend(newComment);
                     console.log(newComment);
                     deleteCommentDom($(' .delete-comment-button', newComment))
                     console.log('comment creation success handler')

                     // CHANGE :: enable the functionality of the toggle like button on the new post
                     new ToggleLike($(' .toggle-like-button', newComment));
                     

                     new Noty({
                        theme: 'relax',
                        text: "Comment published!",
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

    let  newCommentDom = function(comment){
       return $(`    
                 <div id="comment-${comment._id}" style="margin-bottom:8px;"> 
                        <small>
                            <a class='delete-comment-button' href="/comment/destroy/${comment._id}">X</a>
                        </small>
                
                        <span> ${comment.content} <span>
                        <br>
                        <small>
                            ${ comment.user.name}
                        </small><br>

                        <small>
                            <a class="toggle-like-button" data-likes="0"  href= "/likes/toggle/?id=${comment._id}&type=comment" id="likebtn"> 
                                0 Likes
                            </a>
                        </small>
                </div> `)
    }


    let deleteCommentDom = function(deletelink){
        console.log(deletelink);
        $(deletelink).click(function(e){
            console.log('inside delete function')
            e.preventDefault();
            console.log('sending ajax req');

            $.ajax({
                method: 'GET',
                url: $(deletelink).prop('href'),
                success: function(resData){
                    console.log('in success handler')
                    console.log(resData);
                     $(`#comment-${resData.data.comment_id}`).remove();

                     new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function(error){
                    console.log('in error handler')
                    console.log(error.responseText);
                }
            });

        })
    }

    createComment();
}