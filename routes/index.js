const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
// For all get type request for the path '/' this (homeController.home) function will be called
/* homeController = {home: function(){
  res.end('<h1>Express is up for codial</h1>')
}}
Basically homeController is an object that has a property home which has a value of a function
*/

console.log('router loaded');
module.exports = router;