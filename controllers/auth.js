var express = require('express');
var passport = require('../config/ppConfig');
var request = require('request');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();


router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var zip = req.body.zip;
  var cityname = req.body.cityname;
  var image = req.body.image;
  var age = req.body.age;
  var historystart = req.body.historystart;
  var historyend = req.body.historyend;

  if(!zip){
    zip = "98101.1.99999";
  }

  if(!cityname){
    cityname = "Seattle, Washington";
  }

  if(!image){
    image = "/img/user.png";
  }

  if(!historystart){
    historystart = "0701";
  }

  if(!historyend){
    historyend = "0801";
  }

  db.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      name: name,
      password: password,
      zip: zip,
      cityname: cityname,
      image: image,
      age: age,
      historystart: historystart,
      historyend: historyend
    }
  }).spread(function(user, created){
    if(created){
      passport.authenticate('local', {
        successRedirect: '/profile',
        successFlash: 'Account created and logged in'
      })(req, res, next);
    } else{
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error){
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });

});

router.get('/login', function(req, res){
  res.render('auth/login');
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login',
  successFlash: 'Logged in',
  failureFlash: 'Invalid email and/or password'
}));

router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});

module.exports = router;
