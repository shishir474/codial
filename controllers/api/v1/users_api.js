const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req,res){

    try {
        let user = await User.findOne({email: req.body.email});
    
        if (!user || user.password != req.body.password){
            // user is not authorized 
            return res.json(422, {
                message: 'Invalid username or password'
            });
        }
    
        return res.json(200, {
            message: 'Sign in successfull, here is your token, please keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1000000'})  // generating token
            }
        });

    } catch (error) {
        
        return res.json(500, {
            message: 'internal server error'
        });
    }
   
   
}
