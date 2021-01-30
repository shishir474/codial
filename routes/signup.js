const express = require('express');
const router = express.Router();
const signupContoller = require('../controllers/signup_controller');
// Now I've imported my controller function
// NOTE: userController is an object that has a key profile that holds the value of a function

router.get('/', signupContoller.signup);

module.exports = router;