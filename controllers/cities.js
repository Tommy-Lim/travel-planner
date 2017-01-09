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

router.get('/forecast/q/:id', function(req, res){
  var query = req.params.id.split('=')[0];
  var name = req.params.id.split('=')[1];

  query = "q/"+query;
  var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast/"+query+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/forecast', {
      weather: weather,
      name: name
    });
  });

});

router.get('/historical/q/:id', function(req, res){
  var query = req.params.id.split('=')[0];
  var name = req.params.id.split('=')[1];
  query = "q/"+query;

  //MMDD TODO: make this user input
  startDate = "0701";
  endDate = "0714";
  var url = "http://api.wunderground.com/api/b4b355346be47a17/planner_"+startDate+endDate+"/"+query+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/historical', {
      weather: weather,
      name: name
    });
  });

});

router.get('/details/q/:id', function(req, res){
  var query = req.params.id.split('=')[0];
  var name = req.params.id.split('=')[1];
  query = "q/"+query;

  var url = "http://api.wunderground.com/api/b4b355346be47a17/conditions/"+query+".json";

  request.get(url, function(error, response, body){
    var details = JSON.parse(body);
    res.render('cities/details', {
      details: details,
      name: name
    });
  });

});


module.exports = router;
