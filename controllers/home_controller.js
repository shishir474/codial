// I'm exporting this home() so that I can use it in my routes folder.This fucntion is same as 
// my callback function.Now I need to import this in my routes index.js file

const Post = require("../models/post");
const User = require("../models/User");

// async indicates that these function contains some aync statements
module.exports.home = async function(req,res){
    // res.end('<h1>Express is up for codial</h1>');
    
    // UNDERSTANDING COOKIE
    // console.log(req.cookies);
    // res.cookie('hey', 'swapnil');
    // NOTE:: console.log will only be printed if we render the home page as it is written in home controller..That's the reason it wasn't printing earlier
            
     try {
            // find all the posts of the user and accessing it in the views(home.ejs) via pohe persons info by populating 
            let posts = await Post.find({})
            .sort('-createdAt') // sorting the post i.e latest post comes first
            .populate('user')
            .populate({
                path : 'comments',
                populate : {
                path:'user'
              },
              populate: {
                path: 'likes'
              }
            }).populate('likes');
            
            
       // fetch all users and pass its refernce to home.ejs. Since we're using User model we need to import it
          const users = await User.find({});
        //   success

          return res.render('home',{
              title:'Shishir',
              posts: posts,
              all_users: users
          });

     } catch (err) {
         console.log('Error', err);
         return ;
     }

}

console.log('controller loaded')
// module.exports.actionName = function(req,res){}