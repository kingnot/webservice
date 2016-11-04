/*
 * Author: Fei Wang
 * Date: Oct 30, 2016
 * Unit testing cases are defined here,
 * using should() test style.
 */

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
  it('it should respond with redirect on post', function(done) {
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
describe('/ POST', function(){
  it('it should not POST a user without firstname', function(done) {
  	var testUser = {
  		"lastname": "Smith",
  		"email": "js@test.com",
  		"city": "Toronto"
  	};
  	chai.request(app)
  		.post("/")
  		.send(testUser)
  		.end(function(err, res) {
  			if (err) done(err);
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.have.property('errors');
            res.body.errors.should.have.property('firstname');
            res.body.errors.firstname.should.have.property('kind').eql('required');
            done();
  		});
  });
  it('it should not POST a user without lastname', function(done) {
  	var testUser = {
  		"firstname": "John",
  		"email": "js@test.com",
  		"city": "Toronto"
  	};
  	chai.request(app)
  		.post("/")
  		.send(testUser)
  		.end(function(err, res) {
  			if (err) done(err);
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.have.property('errors');
            res.body.errors.should.have.property('lastname');
            res.body.errors.lastname.should.have.property('kind').eql('required');
            done();
  		});
  });
  it('it should not POST a user without email', function(done) {
  	var testUser = {
  		"firstname": "John",
  		"lastname": "Smith",
  		"city": "Toronto"
  	};
  	chai.request(app)
  		.post("/")
  		.send(testUser)
  		.end(function(err, res) {
  			if (err) done(err);
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.have.property('errors');
            res.body.errors.should.have.property('email');
            res.body.errors.email.should.have.property('kind').eql('required');
            done();
  		});
  });
  it('it should not POST a user without city', function(done) {
  	var testUser = {
  		"firstname": "John",
  		"lastname": "Smith",
  		"email": "js@test.com"
  	};
  	chai.request(app)
  		.post("/")
  		.send(testUser)
  		.end(function(err, res) {
  			if (err) done(err);
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.have.property('errors');
            res.body.errors.should.have.property('city');
            res.body.errors.city.should.have.property('kind').eql('required');
            done();
  		});
  });
  it('it should POST a user', function(done) {
  	var testUser = {
  		"firstname": "John",
  		"lastname": "Smith",
  		"email": "js@test.com",
  		"city": "Toronto"
  	};
  	chai.request(app)
  		.post("/")
  		.send(testUser)
  		.end(function(err, res) {
  			if (err) done(err);
  			res.should.have.status(200);
  			res.should.be.json;
  			res.body.should.have.property('message').have.string("New User Created! Email: ");
            res.body.newUser.should.have.property('firstname');
            res.body.newUser.should.have.property('lastname');
            res.body.newUser.should.have.property('email');
            res.body.newUser.should.have.property('city');
            done();
  		});
  });
});

/*
 * Test the /user route with RESTful verbs
 */
describe('Users', function() {
    beforeEach(function(done) {
    	// remove all the user documents for testing
        User.remove({}, function(err) { 
           done();         
        });     
    });
 /*
  * Test the /GET/user route
  */
  describe('/GET user', function() {
      it('it should GET all the users', function(done) {
            chai.request(app)
            .get('/user')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
 /*
  * Test the /POST/user/ route
  */
  describe('/POST user', function() {
      it('it should not POST a user without email field', function(done) {
        var user = {
            "firstname": "John",
  			"lastname": "Smith",
  			"city": "Toronto"
        }
            chai.request(app)
            .post('/user')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email');
                res.body.errors.email.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a user ', function(done) {
        var user = {
            "firstname": "John",
  			"lastname": "Smith",
  			"email": "js@test.com",
  			"city": "Toronto"
        }
            chai.request(app)
            .post('/user')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully added!');
                res.body.user.should.have.property('firstname');
                res.body.user.should.have.property('lastname');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('city');
              done();
            });
      });
  });
 /*
  * Test the /GET/user/:id route
  */
  describe('/GET/:id user', function() {
      it('it should GET a user by the given id', function(done) {
        var user = new User({ firstname: "John", lastname: "Smith", email: "js@test.com", city: "Toronto" });
        user.save(function(err, user) {
            chai.request(app)
            .get('/user/' + user.id)
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('email');
                res.body.should.have.property('city');
                res.body.should.have.property('_id').eql(user.id);
              done();
            });
        });

      });
  });
 /*
  * Test the /PUT/user/:id route
  */
  describe('/PUT/:id user', function() {
      it('it should UPDATE a user given the id', function(done) {
        var user = new User({firstname: "Tony", lastname: "Stark", email: "ironman@avengers.com", city: "New York"})
        user.save(function(err, user) {
                chai.request(app)
                .put('/user/' + user.id)
                .send({firstname: "Tony", lastname: "Stark", email: "ironman@avengers.com", city: "New York"})
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User updated!');
                    res.body.user.should.have.property('city').eql("New York");
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/user/:id route
  */
  describe('/DELETE/:id user', function() {
      it('it should DELETE a user given the id', function(done) {
        var user = new User({firstname: "Tony", lastname: "Stark", email: "ironman@avengers.com", city: "New York"})
        user.save(function(err, user) {
                chai.request(app)
                .delete('/user/' + user.id)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                  done();
                });
          });
      });
  });
});
 