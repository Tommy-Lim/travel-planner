var express = require('express');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();


router.get('/', isLoggedIn, function(req, res){

  // home city weather
  var url = "http://api.wunderground.com/api/b4b355346be47a17/forecast/"+query+".json";

  // request.get(url, function(error, response, body){
  //   var weather = JSON.parse(body);
  //   res.render('cities/forecast', {
  //     weather: weather,
  //     name: name
  //   });
  // });



  res.render('profile/index');
});


module.exports = router;
