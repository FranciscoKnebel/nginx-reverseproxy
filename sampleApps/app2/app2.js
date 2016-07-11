var express = require('express');
var app = express();
var port = 8002;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port, 'localhost', function(){
	console.log("Listening on port " + port);
});
