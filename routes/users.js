const express = require('express');
const router = express.Router();
const userContoller = require('../controllers/users_controller');
// Now I've imported my controller function
// NOTE: userController is an object that has a key profile that holds the value of a function

router.get('/', userContoller.userList);
router.get('/profile', userContoller.profile);

module.exports = router;