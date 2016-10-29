var chai = require('chai');
var assert = chai.assert;
//included supertest module for api testing
var supertest = require('supertest');
app = require('../server');

describe('Json', function() {
  it('json passed to server thu POST', function(){
  	var json = [{"name": "test"}];
  	assert.equal(json.length, 1);
  });
});

exports.addition_should_accept_numbers = function(done){
  supertest(app)
  .get('/echo?a=1')
  .expect(200)
  .end(done);
};

exports.addition_should_accept_strings = function(done){
  supertest(app)
  .get('/echo?a=foobar')
  .expect(200)
  .end(done);
};