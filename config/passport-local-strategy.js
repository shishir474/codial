const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    // we set this property to true bcoz we neeed req object in callback to set the flash message
    passReqToCallback: true
},
function(req, email,password,done){ // email,password passed to the function is basically that email,password that is sent by the form/entered by the user

    // find a user with the help of email and establish the identity
    User.findOne({email: email}, function(err,user){
        if (err){
           // console.log('Error in finding the user courtesy to passport');
            req.flash('error','Error in finding the user courtesy to passport');
            return done(err);
        }

        if (!user || user.password != password){
            // if user doesn't exist or password mismatch happens 
           // console.log('invalid username/password');
           req.flash('error', 'invalid username/password');
            return done(null, false);
        }

        return done(null, user);
    });
}

));


// serializing the user to decide which key is to be kept in the cookies
// serialize user is setting id as cookie in user's browser
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
// deserializeUser is getting id from the cookie, which is then used in callback to get user info 
passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        if (err){
            console.log('Error in finding user courtesy to passport');
            return done(err);
        }

        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    if (req.isAuthenticated()){
        // if the req is authenticated i.e. the user is signed in then pass on the req to the next function(controller action)
        return next();
    }
   // if the user is not signed in
    return res.redirect('/users/sign-in');
}

// set the user for the views if its authenticated
passport.setAuthenticatedUser = function(req,res,next){
    if (req.isAuthenticated()){
// req.user contains the info of the current signed in user from the session cookie & we're just sending it the the locals for the views
        res.locals.user = req.user;
        // res.locals is available to the view's rednered/ frontend part
    }
    next();
}



module.exports = passport;