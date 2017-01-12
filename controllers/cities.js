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

  var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast10day/q/zmw:"+zip+".1.99999.json";

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

  //MMDD TODO: make this user input
  startDate = "0701";
  endDate = "0714";

  var url = "http://api.wunderground.com/api/b4b355346be47a17/planner_"+startDate+endDate+"/q/zmw:"+zip+".1.99999.json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/historical', {
      weather: weather,
      name: name
    });
  });

});

router.get('/details/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var url = "http://api.wunderground.com/api/b4b355346be47a17/conditions/q/zmw:"+zip+".1.99999.json";

  request.get(url, function(error, response, body){
    var details = JSON.parse(body);
    res.render('cities/details', {
      details: details,
      name: name
    });
  });

});


module.exports = router;
