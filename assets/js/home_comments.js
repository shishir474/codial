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