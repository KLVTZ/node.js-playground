Express Framework
=================
In this lesson, we take a look at grabbing data from the URL and then parsing it
into usable data from the request. We first take advantage of the express
framework. Express framework is a fast, non opinionated, minimalist web framework
for node. Express offers an easy-to-use framework for connecting to the server
and then using information to process response and request cycles.

We set our default parameters, including `var app = require("express");`. We
then call `app.get()` for the user identification that will be used as a
variable of a defined user object. The object identifier is set within our
request. We finally check to see if user data exists. If it does, then we
process that data to then use in our anchor tag which will be sent as html. As
we can see, we don't have to tell node the type of request or anything else.
This behavior is built-in. This allows simplicity and code flow. We react if
there is not data found within the user object.

```javascript
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
```
