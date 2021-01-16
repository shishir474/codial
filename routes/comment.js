const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments_controller');

router.get('/',commentsController.comment);
module.exports = router;