const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.get('/',postsController.postRender);
router.get('/likes',postsController.postLikes);
router.use('/comments',require('./comment'));

// 1st check is to not display the form if the user is not authenticated using locals.user(i.e check whether user key is present in locals object or not)
// applying 2nd level of check whether the user is signed in or not. Request to '/posts/create' while submitting the form data made will 
// only be succesfull if the user is authenticated
router.post('/create',passport.checkAuthentication, postsController.createpost);

// The user should be logged in(Thats why we wrote passport.checkAuthentication). NOt everyone can delete it
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);
module.exports = router;

