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

router.get('/details/q/:id', function(req, res){
  var query = req.params.id;
  query = "q/"+query;
  var cityUrl = "http://api.wunderground.com/api/b4b355346be47a17/forecast/"+query+".json";

  request.get(cityUrl, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/details', {weather: weather});
  });

});


module.exports = router;
