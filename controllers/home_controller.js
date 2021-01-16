// I'm exporting this home() so that I can use it in my routes folder.This fucntion is same as 
// my callback function.Now I need to import this in my routes index.js file
module.exports.home = function(req,res){
    res.end('<h1>Express is up for codial</h1>');
}
// module.exports.actionName = function(req,res){}