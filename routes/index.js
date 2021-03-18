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
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comment', require('./comment'));
/* for any other routes access from here
 router.use('/routerName',require('./routerfile'));
*/

router.use('/signup',require('./signup'))
router.use('/create-user',require('./create-user'));
router.use('/api', require('./api'));

router.use('/likes', require('./likes'));

console.log('router loaded');
module.exports = router;