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
    request(app).get('/').expect(200, done);
  });
});
