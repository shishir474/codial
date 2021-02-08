const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email'
},
function(email,password,done){
    // find a user and establish the identity
    User.findOne({email: email}, function(err,user){
        if (err){
            console.log('Error in finding the user courtesy to passport');
            return done(err);
        }

        if (!user || user.password != password){
            console.log('invalid username/password');
            return done(null, false);
        }

        return done(null, user);
    });
}

));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
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
        res.locals.post = req.post;
    }
    next();
}



module.exports = passport;