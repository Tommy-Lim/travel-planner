var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();



router.get('/', function(req, res){
  res.render('cities/index');
});

router.post('/search', function(req, res){

  var query = req.body.search;
  var citiesUrl = "http://autocomplete.wunderground.com/aq?query="+query;

  request.post(citiesUrl, function(error, response, body){
    var cities = JSON.parse(body).RESULTS;
    res.render('cities/search', {cities: cities});
  });

});







module.exports = router;
