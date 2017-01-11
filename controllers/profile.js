var express = require('express');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();

// Directs user to profile if logged in
router.get('/', isLoggedIn, function(req, res){

  var zip = req.user.zip;
  // home city weather
  var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast10day/q/zmw:"+zip+".1.99999.json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('profile/index', {
      weather: weather,
      zip: zip
    });
  });

});


// Add a city to your profile
router.post('/', isLoggedIn, function(req, res){

  var query = req.user.zip;
  // home city weather
  var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast10day/q/zmw:"+query+".1.99999.json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('profile/index', {
      weather: weather,
      zip: query
    });
  });

});

router.get('/settings', isLoggedIn, function(req, res){
  res.render('profile/settings', {
    user: req.user
  });
});

router.post('/settings', isLoggedIn, function(req, res){
  db.user.findById(req.user.id).then(function(user){
    user.update(req.body);
    req.flash('success', 'Profile settings updated');
    res.redirect('/profile');
  }).catch(function(error){
    res.send('error', error.message);
  });

});


module.exports = router;
