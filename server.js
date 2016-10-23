// Include express module for easier REST routes
var express = require('express');
var server = express();

//Rsponde with Hello World to default route to all requests
server.get('/', function(req, res){
	res.send('Hello World');
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(3000, function(){
	console.log('Server running at http://127.0.0.1:3000/');
});
