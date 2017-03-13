//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var db = require('../models');
var router = express.Router();

// SHOW FLIGHTS SEARCH FORM
router.get('/', function(req, res){
  res.render('flights/index', {
  });
});

router.post('/', function(req, res){
  var query = req.body;
  console.log(req.body);

  // BUILD THE FLIGHT REQUEST OBJECT
  var url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + process.env.GOOGLE_FLIGHTS_KEY;
  var requestObj = {
    request: {
      passengers: {
        adultCount: query.passengers,
      },
      slice: [
        {
          origin: query.origin,
          destination: query.destination,
          date: query.departureDate,
        },
        {
          origin: query.destination,
          destination: query.origin,
          date: query.returnDate,
        }
      ],
      saleCountry: "US",
      ticketingCountry: "US",
      solutions: 20
    }
  }

  request.post({
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  }, function(err, response, body){
    console.log("ERR", err)
    console.log("BODY", body)
    res.render('flights/index', {
      "query": requestObj.request,
      "response": response
    })
  })


})


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
