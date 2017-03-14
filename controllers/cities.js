//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

// SHOW CITIES FROM SEARCH RESULTS
router.get('/', function(req, res){

  var query = req.query.search;
  var citiesUrl = "http://autocomplete.wunderground.com/aq?query="+query;

  request.get(citiesUrl, function(error, response, body){
    var cities = JSON.parse(body).RESULTS;
    res.render('cities/results', {
      cities: cities,
      query: req.query.search
    });
  });

});

// SHOW FORECAST FOR CITY
router.get('/forecast/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/forecast10day/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var weather = JSON.parse(body);
    res.render('cities/forecast', {
      weather: weather,
      name: name,
      zip: zip
    });
  });

});

// SHOW HISTORICAL WEATHER FOR CITY
router.get('/historical/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var startDate;
  var endDate;

  //set dates to user or session or default settings in order
  if(req.user && req.user.historystart){
    startDate = req.user.historystart;
  } else if(req.session && req.session.startDate){
    startDate = req.session.startDate;
  } else{
    startDate = "0701";
  }

  if(req.user && req.user.historyend){
    endDate = req.user.historyend;
  } else if(req.session && req.session.endDate){
    endDate = req.session.endDate;
  } else{
    endDate = "0801";
  }

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

// CHANGE HISTORICAL START AND END DATES
router.post('/historical/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var startDate = req.body.historystart;
  var endDate = req.body.historyend;
  
  req.session.startDate = startDate;
  req.session.endDate = endDate;

  //set db values if logged in
  if(!req.user){

  }else{
    db.user.findById(req.user.id).then(function(user){
      user.update({
        historystart: startDate,
        historyend: endDate
      });
      req.flash('success', 'Travel/history dates updated');
    }).catch(function(error){
      res.send('error', error.message);
    });
  }

  res.redirect('/cities/historical/'+zip+"="+name);

});

// SHOW CITY DETAILS
router.get('/details/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var url = "http://api.wunderground.com/api/"+process.env.WEATHER_APP_KEY+"/conditions/q/zmw:"+zip+".json";

  request.get(url, function(error, response, body){
    var details = JSON.parse(body);
    res.render('cities/details', {
      details: details,
      name: name,
      zip: zip
    });
  });

});


module.exports = router;
