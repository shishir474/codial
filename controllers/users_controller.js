// Since I'm using my collection User here I need to import it
const passport = require('passport');
const User = require('../models/User');

module.exports.profile = function(req,res){
    // res.end('<h1>Rendered users profile succesfully</h1>')
 
     // I need to find the user with the help of id that is coming as part of the route
     User.findById(req.params.id, function(err,user){
        
        return res.render('user',{
            title:'user profile',
            number:'10,000',
            user:user
        });

     })

    
} 
//Now i've exported my contoller function nd now I need to import it in router file(users.js)

module.exports.userList = function(req,res){
    res.end('<h1>Rendered users list succesfully</h1>')
} 

// render the sign up page
module.exports.signUp = function(req,res){
    if (req.isAuthenticated()){
        // limiting the access of signup/signin page to user once signed in
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: 'codial|signUp'
    })
}


// render the sign in page
module.exports.signIn = function(req,res){
    if (req.isAuthenticated()){
        // limiting the access of signup/signin page to user once signed in
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: 'codial|signIn'
    })
}

// get the sign up data
module.exports.create = function(req,res){
   // if password and confirm_password aren't same then return back
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    // password and confirm_password are same so we will try to find the user by its email(email is unique to every user)
    // If it exists then we do not create it else we create it
     
   User.findOne({email: req.body.email}, function(err,user){
       if (err){console.log('error in finding user in signing up'); return}

       if (!user){
           // user does not exist
           User.create(req.body,function(err,user){
               if (err){console.log('error in creating user while signing up'); return}

               return res.redirect('/users/sign-in');
           })
       }else{
           // user exists
           return res.redirect('back')
           // In both cases when password doesn't match with confirm password and user already exists we're redirecting back.
       }
   });

}

// sign in and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}

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