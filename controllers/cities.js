var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();



router.get('/', function(req, res){
  res.render('cities/index');
});

router.post('/', function(req, res){

  var query = req.body.search;
  var citiesUrl = "http://autocomplete.wunderground.com/aq?query="+query;
  console.log('citiesUrl: ', citiesUrl);
  request(citiesUrl, function(error, response, body){
    var cities = JSON.parse(body).results;
    console.log(cities);
    res.send(cities);
    // res.render('cities/index', {cities: cities});
  });

});







module.exports = router;
