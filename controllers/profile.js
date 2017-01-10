var express = require('express');
var db = require('../models');
var router = express.Router();


router.get('/', function(req, res){
  res.render('profile/index');
});


module.exports = router;
