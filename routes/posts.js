const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts_controller');

router.get('/',postsController.postRender);
router.get('/likes',postsController.postLikes);
router.use('/comments',require('./comment'));

router.post('/create', postsController.createpost);

module.exports = router;