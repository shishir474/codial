const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/users_controller');
// Now I've imported my controller function
// NOTE: userController is an object that has a key profile that holds the value of a function

router.get('/', userController.userList);
// render profile page only when the user is signed in
router.get('/profile/:id', passport.checkAuthentication , userController.profile);
// route for updating the user
router.post('/update/:id', passport.checkAuthentication , userController.update);
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
// route for creating the user
router.post('/create',userController.create);

// passport.authenticate() authenticates. IF the authentication is succesful userController.createSession action is called else failureRedirect
router.post('/create-session',passport.authenticate(
    'local',   // local here means we're using passport-local stratregy to authenticate
    {failureRedirect: '/users/sign-in'}
),userController.createSession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);

router.get('/sign-out',userController.destroySession);

router.get('/forgot', userController.resetPassword); // to render forgot password page

// to handle form of forgot password. user will send email on which he wants to recieve reset password link
router.post('/reset-password', userController.reset)
router.get('/reset/:token', userController.resetPasswordMailToken);
router.post('/changepassword/:token', userController.changePassword);

module.exports = router;