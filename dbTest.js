var express = require('express');
var db = require('./models');

// clear airports
db.airport.findAll().then(function(entries){
  console.log('entries: ', entries);
  entries.forEach(function(entry){
    entry.destroy();
  });
});

// clear cities
db.city.findAll().then(function(entries){
  console.log('entries: ', entries);
  entries.forEach(function(entry){
    entry.destroy();
  });
});

// clear countries
db.country.findAll().then(function(entries){
  console.log('entries: ', entries);
  entries.forEach(function(entry){
    entry.destroy();
  });
});

// clear users
db.user.findAll().then(function(entries){
  console.log('entries: ', entries);
  entries.forEach(function(entry){
    entry.destroy();
  });
});



// add an airport
db.airport.create({
  name: 'Seatac',
  lettercode: 'SEA',
  numbercode: '1234'
}).catch(function(err){
  console.log('Database error: ',err);
});

// check if duplicate airport made
db.airport.findOrCreate({
  where: {
    name: 'Seatac'
  },
  defaults: {
    lettercode: 'SEA',
    numbercode: '1234'
  }
}).spread(function(airport, created){
  console.log('Airport existed: ',airport);
  console.log('Airport created: ', created);
}).catch(function(err){
  console.log('Database error: ',err);
});


// add a city
db.city.create({
  name: 'Seattle',
  country: 'United States',
  code: '1234'
}).catch(function(err){
  console.log('Database error: ',err);
});

// check if duplicate city made
db.city.findOrCreate({
  where: {
    name: 'Seattle'
  },
  defaults: {
    country: 'United States',
    code: '1234'
  }
}).spread(function(city, created){
  console.log('City existed: ',city);
  console.log('City created: ', created);
}).catch(function(err){
  console.log('Database error: ',err);
});


// add a country
db.country.create({
  name: 'United States',
  code: '1234'
}).catch(function(err){
  console.log('Database error: ',err);
});

// check if duplicate country made
db.country.findOrCreate({
  where: {
    name: 'United States'
  },
  defaults: {
    code: '1234'
  }
}).spread(function(country, created){
  console.log('Country existed: ',country);
  console.log('Country created: ', created);
}).catch(function(err){
  console.log('Database error: ',err);
});


// add a user
db.user.create({
  name: 'Jane Doe',
  email: 'email@co.com',
  password: 'password',
  image: 'http://www.google.com/image/587587.png',
  age: '25',
  currentcity: 'Seattle'
}).catch(function(err){
  console.log('Database error: ',err);
});

// check if duplicate user made
db.user.findOrCreate({
  where: {
    name: 'Jane Doe'
  },
  defaults: {
    email: 'email@co.com',
    password: 'password',
    image: 'http://www.google.com/image/587587.png',
    age: '25',
    currentcity: 'Seattle'
  }
}).spread(function(user, created){
  console.log('User existed: ',user);
  console.log('User created: ', created);
}).catch(function(err){
  console.log('Database error: ',err);
});
