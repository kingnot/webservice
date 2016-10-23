// Include express module for easier REST routes
var express = require('express');
// Include middle-ware body-parser to pull POST cotent from http request
var bodyParser = require('body-parser');

// Define application using express
var app = express();
//configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Responde with text that is passed to
app.post('/', function(req, res){
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
