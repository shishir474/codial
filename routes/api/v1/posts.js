const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postsApi.destroy); // setting session to be false to prevent session cookies to be generated. I do not want session cookies to be generated


module.exports = router;