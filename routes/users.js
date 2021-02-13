const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');
// Now I've imported my controller function
// NOTE: userController is an object that has a key profile that holds the value of a function

router.get('/', userController.userList);
router.get('/profile/:id', passport.checkAuthentication , userController.profile);
router.post('/update/:id', passport.checkAuthentication , userController.update);
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create);

// passport.authenticate() authenticates. IF the authentication is succesful userController.createSession action is called else failureRedirect
router.post('/create-session',passport.authenticate(
    'local',   // local here means we're using passport-local stratregy to authenticate
    {failureRedirect: '/users/sign-in'}
),userController.createSession);

router.get('/sign-out',userController.destroySession);



module.exports = router;