var express = require('express');
var request = require('request');
var path = require('path');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var moment = require('moment');
var db = require('./models');
var app = express();
var session = require('express-session');
var passport = require('passport');
var flash = require('flash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));

app.use(function(req, res, next){
  res.locals.moment = moment;
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'travel secrets',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res){
  res.render('index');
});

app.use('/profile', require('./controllers/profile'));
app.use('/cities', require('./controllers/cities'));
app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
