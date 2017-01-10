var express = require('express');
var passport = require('../config/ppConfig');
var request = require('request');
var db = require('../models');
var router = express.Router();


router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var zip = req.body.zip;

  db.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      name: name,
      password: password,
      zip: zip
    }
  }).spread(function(user, created){
    if(created){
      passport.authenticate('local', {
        successRedirect: '/profile'
      })(req,res);
    } else{
      console.log('Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error){
    console.log('An error occurred: ', error.message);
    res.redirect('/auth/signup');
  });

});

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login'
}));

router.get('/logout', function(req, res){
  req.logout();
  console.log('Logged out');
  res.redirect('/');
});

module.exports = router;
