{let t=function(){let t=$("#new-post-form");t.submit((function(o){o.preventDefault(),$.ajax({method:"post",url:"/posts/create",data:t.serialize(),success:function(t){console.log(t);let o=e(t.data.post);$("#posts-list-container > ul").prepend(o),n($(" .delete-post-button",o)),new PostComments(data.data.post._id),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Post published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})}))},e=function(t){return $(` <li id="post-${t._id}">\n                        <p>\n                                   \n                                <small>\n                                    <a href="/posts/destroy/${t._id}" class="delete-post-button">X</a>\n                                </small>\n\n                                ${t.content}\n                                <br>\n                                <small>${t.user.name}</small><br>\n                                <small>\n                                    <a  class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${t._id}&type=post" id="likebtn"> \n                                        0 Likes\n                                    </a>\n                                </small>\n                                \n                        </p>\n                        \n                        <div class="post-comments">\n                        \n                     \n                                <form action="/comment/create" id="post-${t._id}-comments-form" method="POST">\n                                    <input type="text" name="content" placeholder="Type Here to add comment...">\n                                    \x3c!-- sending id of the post to which the comment belongs to in a hidden manner --\x3e\n                                    <input type="hidden" name="post" value="${t._id}">\n                                    <input type="submit" value="Add comment">\n                                </form>\n                            \n                        \n                                <div class="post-comments-list">\n                                    <ul id="post-comments-${t._id}">\n                                                      \n                                    </ul>\n                                </div>\n                    \n                        </div>\n            </li>`)},n=function(t){$(t).click((function(e){e.preventDefault(),$.ajax({method:"GET",url:$(t).prop("href"),success:function(t){$("#post-"+t.data.post_id).remove(),new Noty({theme:"relax",text:"Post Deleted!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(t){console.log(t.responseText)}})}))},o=function(){$("#posts-list-container>ul>li").each((function(){let t=$(this),e=$(" .delete-post-button",t);n(e);let o=t.prop("id").split("-")[1];new PostComments(o)}))};t(),o()}