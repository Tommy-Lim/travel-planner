var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();


router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res){

});

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.post('/login', function(req, res){

});



module.exports = router;
