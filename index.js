var express = require('express');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var moment = require('moment');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));

app.use(function(req, res, next){
  res.locals.moment = moment;
  next();
});

app.get('/', function(req, res){

  res.render('index');
});

app.use('/dashboard', require('./controllers/dashboard'));
app.use('/cities', require('./controllers/cities'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
