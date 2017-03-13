//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var passport = require('./config/ppConfig');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var moment = require('moment');
var db = require('./models');
var app = express();
var session = require('express-session');
var flash = require('connect-flash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));

// USE MOMENTS FOR TIME AND DATE DISPLAY
app.use(function(req, res, next){
  res.locals.moment = moment;
  next();
});

// USE SESSION SECRET FOR TOKENS AND LOGGING IN
app.use(session({
  secret: process.env.SESSION_SECRET || 'temp secret',
  resave: false,
  saveUninitialized: true
}));

// USE PASSPORT FOR AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

// USE FLASH FOR FLASH MESSAGES ON SUCCESS AND FAIL
app.use(flash());

// USE RES.LOCALS FOR LOCAL STORAGE INDEPENDENT OF LOGGING IN
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// SHOW HOME PAGE
app.get('/', function(req, res){
  res.render('index');
});

// USE ROUTES FOR EACH CONTROLLER
app.use('/profile', require('./controllers/profile'));
app.use('/cities', require('./controllers/cities'));
app.use('/auth', require('./controllers/auth'));
app.use('/flights', require('./controllers/flights'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
