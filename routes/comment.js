const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.get('/',commentsController.comment);
router.post('/create',passport.checkAuthentication, commentsController.createcomment);
router.get('/destroy/:id',passport.checkAuthentication, commentsController.destroy);

module.exports = router;