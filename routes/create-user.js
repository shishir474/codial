const express = require('express');
const router = express.Router();
const createuserContoller = require('../controllers/create-user_controller');
// Now I've imported my controller function

router.post('/', createuserContoller.createuser);

module.exports = router;