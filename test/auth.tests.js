var expect = require('chai').expect;
var request = require('supertest');
var app = require('../index');
var db = require('../models');

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    done();
  });
});

describe('GET', function(){
  it('should return a 200 response', function(done){
    request(app).get('/auth/login').expect(200, done);
  });
});

describe('GET', function(){
  it('should return a 200 response', function(done){
    request(app).get('/auth/signup').expect(200, done);
  });
});
