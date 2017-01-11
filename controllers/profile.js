var express = require('express');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();

// DIRECTS A USER TO THEIR PROFILE
router.get('/', isLoggedIn, function(req, res){

  db.user.find({
    where: {
      email: req.user.email
    },
    include: [db.city]
  }).then(function(user){

    var zip = req.user.zip;
    // home city weather
    var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast10day/q/zmw:"+zip+".1.99999.json";

    request.get(url, function(error, response, body){
      var weather = JSON.parse(body);
      console.log('weather: ', weather);
      console.log('user cities: ', user.cities);
      res.render('profile/index', {
        weather: weather,
        zip: zip,
        user: user
      });
    });

  });

});

// SHOWS SETTINGS FORM FOR EDITING
router.get('/settings', isLoggedIn, function(req, res){
  res.render('profile/settings', {
    user: req.user
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

// ADDS A DESTINATION CITY TO USER IN DATABASE
router.post('/:zmw', isLoggedIn, function(req, res){
  var zmw = req.params.zmw;
  console.log('zmw: ', zmw);
  console.log('user: ', req.user.email);

  db.user.findOrCreate({
    where: {
      email: req.user.email
    }
  }).spread(function(user, created){
    db.city.findOrCreate({
      where: {
        zip: zmw
      }
    }).spread(function(city, created){
      user.addCity(city);
      req.flash('success', city.zip+' added');
      res.redirect('/profile');
    });
  });
});


module.exports = router;
