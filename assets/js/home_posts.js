// this script file fetches the data from the form(create post form in home.ejs) and sends it in json format to the action. Whenver I am subitting the form to create a new post it should not get submitted automatically. should be submitted via jquery ajax.. so first include jquery link in layout.ejs
{
    //console.log('helo');...=> script loaded succesfully
    // now while creating a post.. we need two things 1) function which handles the submission of this form data(sending data) and 2nd) function which recieves the data of this post and displays it
   
   // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        // whenever this form is submitted I dont want it to submit naturally i.e prevent its default behaviour
        newPostForm.submit(function(e){
                e.preventDefault();

       // so now we need to manually submit form data...we will use ajax for this 
                $.ajax({
                    method: 'post',
                    url : '/posts/create',
                    data: newPostForm.serialize(),  // serialize() converts the form data into json(i.e key-value pairs)
                    success: function(resData){  // resDat is already in json format
                        console.log(resData);// => I've succesfully recieved the form data so now I just need to display it
                       
                        let newPost = newPostDom(resData.data.post);
                       
                        $('#posts-list-container > ul').prepend(newPost);  // prepend means putting it at the first position.. so now the post will be added at the top
                        
                        deletePost($(' .delete-post-button', newPost));

                            // call the create comment class
                         new PostComments(data.data.post._id);

                        // CHANGE :: enable the functionality of the toggle like button on the new post
                        new ToggleLike($(' .toggle-like-button', newPost));


                        new Noty({
                            theme: 'relax',
                            text: "Post published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                            
                        }).show();

                    }, error: function(error){
                        console.log(error.responseText);
                    }
                }); // once we submit we will recieve the form data in post controller
        });
    }


    
    // method to create a post in DOM
    // this function displays post on the template
     // delete buttton should only be visible to logged in user. The person who is able to create a post will be getting this delete btn added in real time                     
    //   user is already signed in as we created a post. so remove checking whether user is signed in or not while posting comment
     // INside <ul>...for loop is removed as when I add a comment it will be automatically appended to this <ul>
    let newPostDom = function(post){
        return $(` <li id="post-${post._id}">
                        <p>
                                   
                                <small>
                                    <a href="/posts/destroy/${post._id}" class="delete-post-button">X</a>
                                </small>

                                ${post.content}
                                <br>
                                <small>${post.user.name}</small><br>
                                <small>
                                    <a  class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=post" id="likebtn"> 
                                        0 Likes
                                    </a>
                                </small>
                                
                        </p>
                        
                        <div id="post-comment">
                        
                     
                                <form action="/comment/create" id="new-comment-form" method="POST">
                                    <input type="text" name="content" placeholder="Type Here to add comment...">
                                    <!-- sending id of the post to which the comment belongs to in a hidden manner -->
                                    <input type="hidden" name="post" value="${post._id}">
                                    <input type="submit" value="Add comment">
                                </form>
                            
                        
                                <div id="post-comments-list">
                                    <ul id="post-comments-${post._id}">
                                                      
                                    </ul>
                                </div>
                    
                        </div>
            </li>`)
    }




    // method to delete post via DOM
    let deletePost = function(deletelink){
        $(deletelink).click(function(e){
            e.preventDefault();

            $.ajax({
                method: 'GET',
                url: $(deletelink).prop('href'),
                success: function(resData){
                    $(`#post-${resData.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function(error){
                    console.log(error.responseText);
                }
            });


        })
    }


    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        })
    }
    createPost();
    convertPostsToAjax();
}