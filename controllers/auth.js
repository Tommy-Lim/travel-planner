//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var passport = require('../config/ppConfig');
var request = require('request');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
var async = require('async');

router.get('/signup', function(req, res){
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next){

  var data = JSON.parse(req.body.json);

  var name = data.formData.name;
  var email = data.formData.email;
  var password = data.formData.password;

  var lat = data.locationData.latitude;
  var lon = data.locationData.longitude;
  var cityname = data.locationData.city+", "+data.locationData.region_name;

  var zip;
  var image;
  var historystart;
  var historyend;

  // GET ZIP BASED ON LAT AND LON DATA
  function getIp(callback){
    request.get('http://api.wunderground.com/api/'+process.env.WEATHER_APP_KEY+'/geolookup/q/'+lat+','+lon+'.json', function(error, response, body){
      var results = JSON.parse(body);
      zip = results.location.l.split(':')[1];
      callback(null, zip);
    });
  }

  function createUser(callback){
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
        historystart: historystart,
        historyend: historyend
      }
    }).spread(function(user, created){
      if(created){
        // passport.authenticate('local', {
        //   successRedirect: '/profile',
        //   successFlash: 'Account created and logged in'
        // })(req, res, next);
        req.flash('success', 'Account created and logged in');
        callback(null, user);
      } else{
        req.flash('error', 'Email already exists');
        // res.redirect('/auth/signup');
        callback('Email already exists', user);
      }
    }).catch(function(error){
      req.flash('error', error.message);
      // res.redirect('/auth/signup');
      callback("database error", error);
    });
  }

  async.series([getIp, createUser], function(err, results){
    res.send({
      error: err,
      results: results
    });
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
