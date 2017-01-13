//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, res){
  res.render('cities/index');
});

router.get('/search', function(req, res){

  var query = req.query.search;
  var citiesUrl = "http://autocomplete.wunderground.com/aq?query="+query;

  request.get(citiesUrl, function(error, response, body){
    var cities = JSON.parse(body).RESULTS;
    res.render('cities/search', {cities: cities});
  });

});

router.get('/search/:id', function(req, res){

  var query = req.params.id;
  var citiesUrl = "http://autocomplete.wunderground.com/aq?query="+query;

  request.get(citiesUrl, function(error, response, body){
    var cities = JSON.parse(body).RESULTS;
    res.render('cities/search', {cities: cities});
  });

});

router.get('/forecast/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/forecast10day/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/forecast', {
      weather: weather,
      name: name
    });
  });

});

router.get('/historical/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  // default to summer
  if(!req.session.startDate){
    req.session.startDate = "0701";
  }

  if(!req.session.endDate){
    req.session.endDate = "0801";
  }

  var startDate = req.session.startDate;
  var endDate = req.session.endDate;

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/planner_"+startDate+endDate+"/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/historical', {
      weather: weather,
      name: name,
      zip: zip
    });
  });

});

router.post('/historical/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  //MMDD TODO: make this user input
  var startDate = req.body.historystart;
  var endDate = req.body.historyend;

  req.session.startDate = startDate;
  req.session.endDate = endDate;

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/planner_"+startDate+endDate+"/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/historical', {
      weather: weather,
      name: name,
      zip: zip
    });
  });

});

router.get('/details/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/conditions/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var details = JSON.parse(body);
    res.render('cities/details', {
      details: details,
      name: name
    });
  });

});


module.exports = router;
