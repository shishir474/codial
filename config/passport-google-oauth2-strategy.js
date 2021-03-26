const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('./environment');

const User = require('../models/User');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_ID,
        clientSecret: env.google_client_Secret,
        callbackURL: env.google_callbackURL
    },

        function(accessToken, refreshToken, profile, done){
            // find a user
            User.findOne({email: profile.emails[0].value}).exec(function(err, user){

                if (err){console.log('error in google-strategy passport', err); return;}

                console.log(profile);
                
                if(user){
                    // if found set this user as req.user
                    return done(null, user);
                }else{
                    // if not found create the user and set it as  req.user
                        User.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            password: crypto.randomBytes(20).toString('hex')

                        },function(err, user){
                            if (err){console.log('error in creating user google-strategy passport', err); return;}
                            return done(null, user);
                        });
                }

            })
        }
))

module.exports = passport