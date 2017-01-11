var express = require('express');
var request = require('request');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();


router.get('/', isLoggedIn, function(req, res){

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


module.exports = router;
