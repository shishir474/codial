const passport = require('passport');
// importing JWT Strategy
const JWTStrategy = require('passport-jwt').Strategy;
// importing module which will extract JWT from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

var opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),  
    // header is a list of keys. It has a key called authorization which is again a list of keys. authorization has a key called bearer which will have the JWT token
    secretOrKey: 'codial'
       // encryption/decryption takes place on the basis of this key(If I change this after genrating token I willn't be able to decrypt that). Later on we willl generate a random hash code  which will be more complicated
}
 
// we need to tell passport to use the JWT Strategy,  payLoad contians the info of the user
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    // finding the user for the req.. req.user will be then this user
    User.findById(jwtPayLoad._id, function(err, user){
        if (err){
            console.log('Error in finding user from JWT');
            return ;
        }

        if (user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    });

}));

module.exports = passport