// Include express module for easier REST routes
var express = require('express');
// Include middle-ware body-parser to pull POST cotent from http request
var bodyParser = require('body-parser');
// Include mongoose so we can use MongoDB
var mongoose = require('mongoose');
// Include route functions for user
var userRoute = require('./routes/user');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
// options to set up for OpenSSL private key and certificate
var options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

// Define application using express
var app = express();
app.use(express.static(__dirname + '/public'));	//to use stylesheets and javascript files in /public directory
// IP defaults to 127.0.0.1
// Created an http service on port 3000, 
var httpServer = http.createServer(app).listen(3000, function(){
    console.log("Http server started at port 3000");
});
// Created an https service on port 8080
var httpsServer = https.createServer(options, app).listen(8080, function(){
    console.log("Https server started at port 8080");
});

//configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));

// Connect to online DB on mLab using connection string
mongoose.connect('mongodb://admin:test123@ds042908.mlab.com:42908/comp2068');
// Use User model
var User = require('./models/user');

// Load index.html with default route
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + "/public/index.html"));
});
// Take user input from form and store in database
app.post('/', function(req, res){
	// create a new instance of User model
	var user = new User();
	// get input from form and save to object
	user.username = req.body.username;
	user.firstname = req.body.firstname;
	user.lastname = req.body.lastname;
	user.email = req.body.email;
	user.city = req.body.city;
	//make sure empty string is not passed
	if (user.username.length && user.firstname.length && user.lastname.length 
		&& user.email.length && user.city.length){
		// save the user object and check for errors
	    user.save(function(err) {
	        if (err)
	            res.send(err);
	        console.log('New User Created! Name: ' + user.username);
	    });
	}
});

//Responde with text that is passed to
app.post('/echo', function(req, res){
	console.log(req.body);
	res.json(req.body);
});

//Responde with Hello World to /hello route to all requests
app.get('/hello', function(req, res){
	res.json("Hello World");
});

/* The whole RESTful web services to be used in the future */
app.route("/user")
	.get(userRoute.getUsers)	//GET to read all the users
	.post(userRoute.postUser);	//POST to create a new user
app.route("/user/:id")
	.get(userRoute.getUser)		//GET to read a user with id
	.delete(userRoute.deleteUser)	//DELETE a user with id
	.put(userRoute.updateUser);		//PUT to update a user with id

module.exports = app;