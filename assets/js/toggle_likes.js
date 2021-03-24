// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            console.log('ajax req made')
            console.log(self)
            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                console.log('json response recieved')
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}


// {
//     //console.log('home_likes loaded');
//     $('#likebtn').click(function(e){
//         e.preventDefault();

//         $.ajax({
//             method: 'GET',
//             url: $('#likebtn').prop('href'),
//             success: function(resData){
//                 console.log(resData);

//                 new Noty({
//                     theme: 'relax',
//                     text: "Post liked",
//                     type: 'success',
//                     layout: 'topRight',
//                     timeout: 1500
                    
//                 }).show();

//             },error: function(error){
//                 console.log(error.responseText);
//             }
//         });
//     })
// }