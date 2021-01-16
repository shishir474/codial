module.exports.postRender = function(req,res){
    res.end('<h1>rendering your Posts..wait for a moment please!!</h1>')
}

module.exports.postLikes = function(req,res){
    res.end('<h1>Wohoo, your Posts likes are 10,000</h1>')
}