// Since I'm using my collection User here I need to import it
const User = require('../models/User');

//NOTE::   ./ refers to just neighbours of my current file 
//         ../ refers to the neighbours of my parent directory

module.exports.createuser = function(req,res){
   console.log('form controller', req.body.name);

   User.create({
       email:req.body.email,
       password:req.body.password,
       name:req.body.name
   },function(err,newUser){
       if (err){
           console.log('error in creating the user');
           return ;
       }
       console.log('********',newUser);
       return res.redirect('back');
   });

   console.log('create-user controller loaded')
}