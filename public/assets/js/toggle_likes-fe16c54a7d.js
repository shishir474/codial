class ToggleLike{constructor(e){this.toggler=e,this.toggleLike()}toggleLike(){$(this.toggler).click((function(e){e.preventDefault();let t=this;$.ajax({type:"GET",url:$(t).attr("href")}).done((function(e){let o=parseInt($(t).attr("data-likes"));console.log(o),console.log("json response recieved"),console.log(e.data.deleted),1==e.data.deleted?o-=1:o+=1,$(t).attr("data-likes",o),$(t).html(o+" Likes")})).fail((function(e){console.log(e),console.log("error in completing the request")}))}))}}