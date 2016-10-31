//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
//include chai for assertion library
var chai = require('chai');
//included chaiHttp module for RESTful testing
var chaiHttp = require('chai-http');
var should = chai.should();	//use should() test style
chai.use(chaiHttp);	//chai could use http functions
//include server.js, User model and mongoose for testing
var app = require('../server');
var mongoose = require('mongoose');
var User = require('../models/user');

/*
 * Test the /hello route with GET
 */
describe('/hello', function() {
	it('it should return Hello World', function(done){
	  chai.request(app)
	  	.get('/hello')
	  	.end(function(err, res) {
	  		res.should.have.status(200);
	  		res.should.be.json;
	  		res.body.should.be.eql("Hello World");
	  		done();
	  	});
	});
});

/*
 * Test the /echo route with POST
 */
describe('/echo POST', function() {
  it('should respond with redirect on post', function(done) {
  	var testMsg = {message: "foobar"};
    chai.request(app)
      .post('/echo')
      .send(testMsg)
      .end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.should.be.eql(testMsg);
      });

  	var testNum = {number: 9};
    chai.request(app)
      .post('/echo')
      .send(testNum)
      .end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('number');
        res.body.should.be.eql(testNum);
        done();
      });

  });
});

/*
 * Test the / route with POST
 */