// Include express module for easier REST routes
var express = require('express');
// Include middle-ware body-parser to pull POST cotent from http request
var bodyParser = require('body-parser');
// Include mongoose so we can use MongoDB
var mongoose = require('mongoose');

// Define application using express
var app = express();
//configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to online DB on mLab using connection string
mongoose.connect('mongodb://admin:test123@ds042908.mlab.com:42908/comp2068');
// Use User model
var User = require('./models/user');

// Load index.html with default route
app.get('/', function(req, res){
	res.sendfile("index.html");
});
// Take user input from form and store in database
app.post('/', function(req, res){
	// create a new instance of User model
	var user = new User();
	user.name = req.body.simpleinput;
	//make sure empty string is not passed
	if (user.name.length){
		// save the user object and check for errors
	    user.save(function(err) {
	        if (err)
	            res.send(err);
	        //res.json({ message: 'New User Created!' });
	        console.log('New User Created! Name: ' + user.name);
	    });
	}
});

//Responde with text that is passed to
app.post('/echo', function(req, res){
	console.log(req.body);
	res.send('ok');
});

//Responde with Hello World to /hello route to all requests
app.get('/hello', function(req, res){
	res.type('text/plain');
	res.send('Hello World');
});

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(3000, function(){
	console.log('Server running at http://127.0.0.1:3000/');
});

module.exports = app;