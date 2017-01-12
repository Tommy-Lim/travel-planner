var express = require('express');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();
var async = require('async');

// DIRECTS A USER TO THEIR PROFILE
router.get('/', isLoggedIn, function(req, res){
  var zips;
  var dbUser;
  var weather = {};
  var history = {};

  //get all zips with the first being the home zip
  function getZips(callback){
    zips = [];
    db.user.find({
      where: {
        email: req.user.email
      },
      include: [db.city]
    }).then(function(user){
      dbUser = user;
      // add the destination zips from users_cities
      user.cities.forEach(function(city){
        zips.push(city.zip);
      });
      // add the home zip from user
      zips.unshift(req.user.zip);
      callback(null, zips);
    });
  }

  // get all weather data
  function getAllWeather(zips, callback){

    var getWeather = function(zip, callback){
      var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast10day/q/zmw:"+zip+".1.99999.json";
      console.log('url for weather: ', url);
      request.get(url, function(error, response, body){
        var singleWeather = JSON.parse(body);
        weather[zip] = singleWeather;
        callback(null, singleWeather);
      });
    };

    async.concat(zips, getWeather, function(err, results){
      callback(null, zips);
    });

  }

  // get historical weather data
  function getAllHistorical(zips, callback){

    var getHistorical = function(zip, callback){
      var url = "http://api.wunderground.com/api/b4b355346be47a17/planner_"+dbUser.historystart+dbUser.historyend+"/q/zmw:"+zip+".1.99999.json";
      console.log('url for history:', url);
      request.get(url, function(error, response, body){
        var singleHistory = JSON.parse(body);
        history[zip] = singleHistory;
        callback(null, singleHistory);
      });
    };

    async.concat(zips, getHistorical, function(err, results){
      callback(null, results);
    });

  }

  async.waterfall([getZips, getAllWeather, getAllHistorical], function(err, results){
    console.log('Object of key:value zip:weather pairs: ', weather);
    console.log('Object of key:value zip:history pairs: ', history);
    res.render('profile/index', {
      weather: weather,
      zips: zips,
      user: dbUser,
      history: history
    });
  });

});

// SUBMITS EDIT FORM AND UPDATES SETTINGS
router.post('/settings', isLoggedIn, function(req, res){
  db.user.findById(req.user.id).then(function(user){
    user.update(req.body);
    req.flash('success', 'Profile settings updated');
    res.redirect('/profile');
  }).catch(function(error){
    res.send('error', error.message);
  });
});

// SUBMITS UPDATE AND REFRESHES PROFILE
router.post('/history', isLoggedIn, function(req, res){
  db.user.findById(req.user.id).then(function(user){
    user.update(req.body);
    req.flash('success', 'History start and end interval updated');
    res.redirect('/profile');
  }).catch(function(error){
    res.send('error', error.message);
  });
});


// DELETE CITY FROM USER_CITIES AND CITIES IF ONLY ASSOCIATION
router.get('/delete/:zip', function(req, res){
  var zip = req.params.zip;
  var email = req.user.email;

  db.user.find({
    where: {
      email: email
    },
    include: [db.city]
  }).then(function(user) {
    db.city.find({
      where: {
        zip: zip
      }
    }).then(function(city) {
      user.removeCity(city).then(function(user) {
        console.log("updated:", user.cities);
        req.flash('success', 'Destination removed');
        res.redirect('/profile');
      });
    });
  });
});

// ADDS A HOME CITY TO USER IN DATABASE
router.get('/home/:zmw', isLoggedIn, function(req, res){
  var zmw = req.params.zmw.split('=')[0];
  var cityname = req.params.zmw.split('=')[1];

  db.user.findOrCreate({
    where: {
      email: req.user.email
    }
  }).spread(function(user, created){
    user.update({
      zip: zmw,
      cityname: cityname
    }). then(function(){
      req.flash('success', 'Home updated');
      res.redirect('/profile');
    });
  });
});

// ADDS A DESTINATION CITY TO USER IN DATABASE
router.get('/:zmw', isLoggedIn, function(req, res){
  var zmw = req.params.zmw.split('=')[0];
  var cityname = req.params.zmw.split('=')[1];

  db.user.findOrCreate({
    where: {
      email: req.user.email
    }
  }).spread(function(user, created){
    db.city.findOrCreate({
      where: {
        zip: zmw
      },
      defaults: {
        cityname: cityname
      }
    }).spread(function(city, created){
      req.flash('success', 'Destination added');
      user.addCity(city);
      res.redirect('/profile');
    });
  });
});




module.exports = router;
