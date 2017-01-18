// CREATES ENVIRONMENT VARIABLE FOR USE WITH .ENV
require('dotenv').config();


//DECLARE VARIABLES AND REQUIRES
var express = require('express');
var passport = require('../config/ppConfig');
var request = require('request');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();
var async = require('async');

// SHOW SIGNUP PAGE
router.get('/signup', function(req, res){
  res.render('auth/signup');
});

// SIGNUP USER BASED ON NAME, EMAIL, PASSWORD, AND IP LOCATION; REDIRECT IF ALREADY EXISTS
router.post('/signup', function(req, res, next){

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if(ip=="::1"){
    ip = "8.8.8.8";
  }

  res.locals.ip = ip;

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  var lat;
  var lon;
  var cityname;

  var zip;
  var image;
  var historystart;
  var historyend;

  // WATERFALL 1 - GET LAT/LON BASED ON IP
  function getLatLon(callback){

    request.get("https://freegeoip.net/json/"+ip, function(error, response, body){

      var locationData = JSON.parse(body);
      lat = locationData.latitude;
      lon = locationData.longitude;
      cityname = locationData.city + ", " + locationData.region_name;
      callback(null, locationData);
    });
  }

  // WATERFALL 2 - GET ZIP BASED ON LAT/LON
  function getZip(locationData, callback){
    request.get('http://api.wunderground.com/api/'+process.env.WEATHER_APP_KEY+'/geolookup/q/'+lat+','+lon+'.json', function(error, response, body){
      var results = JSON.parse(body);
      zip = results.location.l.split(':')[1];
      callback(null, zip);
    });
  }

  // WATERFALL 3 - CREATE USER OR REDIRECT IF ALREADFY EXISTS
  function createUser(zip, callback){
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
        passport.authenticate('local', {
          successRedirect: '/profile',
          successFlash: 'Account created and logged in'
        })(req, res, next);
        callback(null, user);
      } else{
        req.flash('error', 'Email already exists');
        res.redirect('/auth/signup');
        callback('Email already exists', user);
      }
    }).catch(function(error){
      req.flash('error', error.message);
      res.redirect('/auth/signup');
      callback("database error", error);
    });
  }

  // WATERFALL FOR OBTAINING LOCATION AND ZIP, THEN CREATING USER
  async.waterfall([getLatLon, getZip, createUser], function(err, results){
    console.log("finished watrerfall, created and logged in");
  });

});

// SHOW LOGIN PAGE
router.get('/login', function(req, res){
  res.render('auth/login');
});

// LOGIN THEN DIRECT TO PROFILE
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login',
  successFlash: 'Logged in',
  failureFlash: 'Invalid email and/or password'
}));

// LOGOUT THEN DIRECT TO HOME PAGE
router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});

module.exports = router;
