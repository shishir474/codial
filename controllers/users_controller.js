module.exports.profile = function(req,res){
    res.end('<h1>Rendered users profile succesfully</h1>')
} 
//Now i've exported my contoller function nd now I need to import it in router file(users.js)

module.exports.userList = function(req,res){
    res.end('<h1>Rendered users list succesfully</h1>')
} 