var supertest = require('supertest');
app = require('../server');

exports.addition_should_accept_numbers = function(done){
  supertest(app)
  .get('/?a=1')
  .expect(200)
  .end(done);
};

exports.addition_should_accept_strings = function(done){
  supertest(app)
  .get('/?a=foobar')
  .expect(200)
  .end(done);
};