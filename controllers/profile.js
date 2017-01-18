//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();
var async = require('async');
var cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({dest: __dirname + '/uploads/'});

// DIRECTS A USER TO THEIR PROFILE
router.get('/', isLoggedIn, function(req, res){
  var zips;
  var cities;
  var dbUser;
  var weather = {};
  var history = {};

  // WATERFALL 1 - GET ALL ZIPS WITH THE FIRST BEING THE HOME ZIP
  function getZips(callback){
    zips = [];
    db.user.find({
      where: {
        email: req.user.email
      },
      include: [db.city]
    }).then(function(user){
      dbUser = user;
      // ADD THE HOME ZIP TO ZIPS
      zips.push(req.user.zip);
      // ADD DESTINATION ZIPS FROM USER.CITIES TO ZIPS
      user.cities.forEach(function(city){
        zips.push(city.zip);
      });
      callback(null, zips);
    });
  }

  // WATERFALL 2 - GET CITIES FROM ZIPS WITH THE FIRST BEING HOME
  function getCities(zips, callback){
    cities =[];
    zips.forEach(function(zip, index){
      if(index===0){
        // ADD HOME CITY
        cities.push(req.user.cityname);
      } else{
        db.city.find({
          where: {
            zip: zip
          }
        }).then(function(city){
          if(!city){
          } else{
            // ADD DESTINATION CITY
            cities.push(city.cityname);
          }
        });
      }
    });
    callback(null, zips);
  }

  // WATER FALL 3 - GET ALL WEATHER INCLUDING CONCAT
  function getAllWeather(zips, callback){
    // CONCAT 1 - GET WEATHER FOR ONE ZIP
    var getWeather = function(zip, callback){
      var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/forecast10day/q/zmw:"+zip+".json";
      request.get(url, function(error, response, body){
        var singleWeather = JSON.parse(body);
        weather[zip] = singleWeather;
        callback(null, singleWeather);
      });
    };

    // CONCAT FOR GETTING WEATHER FOR ALL ZIPS USING GET WEATHER FOR ONE
    async.concat(zips, getWeather, function(err, results){
      callback(null, zips);
    });

  }

  // WATERFALL 4 - GET HISTORICAL DATA FOR ALL USING CONCAT OF WEATHER FOR ONE
  function getAllHistorical(zips, callback){

    // CONCAT 1 - USE GET HISTORICAL DATA TO GET DATA FOR ALL ZIPS
    var getHistorical = function(zip, callback){
      var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/planner_"+dbUser.historystart+dbUser.historyend+"/q/zmw:"+zip+".json";
      request.get(url, function(error, response, body){
        var singleHistory = JSON.parse(body);
        history[zip] = singleHistory;
        callback(null, singleHistory);
      });
    };

    // CONCAT FOR GETTING ALL HISTORICAL DATA USING GET HISTORICAL FOR ONE
    async.concat(zips, getHistorical, function(err, results){
      callback(null, results);
    });

  }

  // WATERFALL FOR GETTING ALL ZIPS, CITIES, WEATHER, AND HISTORICAL WEATHER
  async.waterfall([getZips, getCities, getAllWeather, getAllHistorical], function(err, results){
    res.render('profile/index', {
      weather: weather,
      zips: zips,
      user: dbUser,
      history: history,
      cities: cities,
    });
  });

});

// UPDATES PROFILE PICTURE LINK USING FILE UPLOAD
router.post('/picture', upload.single('profilePic'), function(req, res){
  cloudinary.uploader.upload(req.file.path, function(result){
    db.user.find({
      where: {
        email: req.user.email
      }
    }).then(function(user){
      user.update({
        image: result.url
      }).then(function(user){
        req.flash('success', 'Profile picture updated');
        res.redirect('/profile');
      });
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
