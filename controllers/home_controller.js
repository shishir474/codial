// I'm exporting this home() so that I can use it in my routes folder.This fucntion is same as 
// my callback function.Now I need to import this in my routes index.js file

const Post = require("../models/post");

module.exports.home = function(req,res){
    // res.end('<h1>Express is up for codial</h1>');
    
    // UNDERSTANDING COOKIE
    // console.log(req.cookies);
    // res.cookie('hey', 'swapnil');
    // NOTE:: console.log will only be printed if we render the home page as it is written in home controller..That's the reason it wasn't printing earlier
    
    // find all the posts of the user and accessing it in the views(home.ejs) via pohe persons info by populating 
    Post.find({}).populate('user').exec(function(err,posts){
        return res.render('home',{
            title:'Shishir',
            posts: posts
        });
    });




}

console.log('controller loaded')
// module.exports.actionName = function(req,res){}