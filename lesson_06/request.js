var fs      = require("fs");
var config  = JSON.parse(fs.readFileSync("config.json"));
var host    = config.host;
var port    = config.port;
var express = require("express");

var app = express();

app.get("/", function(request, response) {
	response.send("Hello, Justin");
})

app.get('/hello/:text', function(request, response) {
	response.send("Hello " + request.params.text);
});


var users = {
	"1" : {
		"name"    : "Justin Page",
		"twitter" : "KLVTZ" 
	},
	"2" : {
		"name"    : "Bobb Page",
		"twitter" : "BobbPage" 
	}
};

app.get('/user/:id', function(request, response) {
	var user = users[request.params.id];
	if (user) {
		response.status(200).send("<a href='https://twitter.com/" + user.twitter + "' target='_blank'>Follow " + user.name + " on twitter</a>");
	} else {
		response.status(400).send("Sorry! We cannot find the user :(");
	}
});

app.listen(port, host);
