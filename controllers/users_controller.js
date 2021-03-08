// Since I'm using my collection User here I need to import it
const passport = require('passport');
const User = require('../models/User');
// importing this 2 modules to delete user avatar if it exixts on uploading a new avatar 
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    // res.end('<h1>Rendered users profile succesfully</h1>')
 
     // I need to find the user with the help of id that is coming as part of the route
     User.findById(req.params.id, function(err,user){
        
        return res.render('user',{
            title:'user profile',
            number:'10,000',
            profile_user:user
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
module.exports.create = async function(req,res){
    try {
            // if password and confirm_password aren't same then return back
            if (req.body.password != req.body.confirm_password){
                req.flash('error', 'password and confirm password does not match');
                return res.redirect('back');
            }

            // password and confirm_password are same so we will try to find the user by its email(email is unique to every user)
            // If it exists then we do not create it else we create it
            
             let user = await User.findOne({email: req.body.email});
        
            if (!user){
            // user does not exist
                await User.create(req.body);
                req.flash('success', 'user created succesfully!')
                    return res.redirect('/users/sign-in');
            }else{
                // user exists
                req.flash('success', 'user already exists');
                return res.redirect('back')
                // In both cases when password doesn't match with confirm password and user already exists we're redirecting back.
            }
    } catch (error) {
        //console.log('Error',error);
        req.flash('error', error);
        return ;
    }

}

// sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in succesfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success', 'You have Logged out!');
    return res.redirect('/');
}

// action for updating the user
module.exports.update = async function(req,res){
    // if (req.user.id == req.params.id){
    //     // checking the one who is sending the req is the one whose id is the part of the URL. Someone could fiddle with that id (in chrome dev tools) which will cause updation of other's profile
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         // callback would either throw an error or would give us an updated user
    //         req.flash('success', 'user updated successfully!')
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'You are not authorized to update the profile')
    //     return res.status(401).send('Unauthorized');
    // }

    if (req.user.id == req.params.id){

        try {
                let user = await User.findById(req.params.id);    // finding user

                // we have saved the users avatar in the directory structure  ... now next step is to display this avatar
                User.uploadAvatar(req, res, function(err){
                    if (err){
                       console.log('****** Multer ERRROR:', err);
                    }
                    //console.log(req.file);

                    // As my form is multipart I need a multer function that will help me to read the req.body..Therefore we created uploadedAvatar
                    user.name = req.body.name;  // I wouldn't have been able to read req.body without this multer thing(uploadAvatar funcyion) bcoz my form is multipart
                    user.email = req.body.email;

                    
                    // if req contains a file
                    if (req.file){
                            // replacing the previous avatar with the new one
                        // here I need to check whether user has an avatar or not and if there is any file linked to that avatar...bcoz if we have deleted all the avatars then there is  no file to unlink hence fs.unlinkSync() would throw an error. so we need to put 2 checks
                        if (user.avatar && fs.existsSync(user.avatar)){
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));// unlinking/deleting the file from user.avatar using fs.unlinkSync()
                        }

                        // this is saving the path of the uploaded file into the avatar field in the current user
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();  // but before returning save the user
                    return res.redirect('back');
            })

        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }
        
    }else{
        req.flash('error', 'You are not authorized to update the profile')
        return res.status(401).send('Unauthorized');
    }
    


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