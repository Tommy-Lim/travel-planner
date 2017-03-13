//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

// SHOW FLIGHTS SEERCH FORM
router.get('/', function(req, res){
  data = {"test": "<p>Hello</p>"}
  res.render('flights/index', {
    data: data
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

module.exports = router;
