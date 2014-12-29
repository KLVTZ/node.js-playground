MongoDB and node
================
In this lesson, we are going to use MongoDB for creating, querying, and
processing data through our server from lesson six. I will divide this
discussion base off of node and the npm module for MongoDB.

In our `connect.js` file, we require the module of `MongoDB`. We then provide a
host and grab the port through the object of connection and its object constant
of default port. We then make a new database called "nodejs-introduction". This
is similar to if we made a new db in mysql. We then provide our new instance of
MongoDB with our configured host and port. We also set the default to `{safe:
true}`. We now open a connection. The connection just has an error parameter and
closure the will console log our successful connection.

We then take advantage of MongoDB's collections. By calling `db.collection()`,
we have access to a collection to which we can now interact with. We provide our
collection with a closure to handle the insertion. After each insertion, we
console log a success message. Remember, the objects are inserted manually.

*connect.js*
```javascript
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
db.open(function(error){
	console.log("We are connected! " + host + ":" + port);


	db.collection("user", function(error, collection) {
		console.log("We have the collection");

		collection.insert({
			id : "1",
			name : "Justin Page",
			twitter : "KLVTZ",
			email : "xjustinpagex@gmail.com"

		}, function() {
			console.log("Successfuly inserted KLVTZ");
		});

		collection.insert({
			id : "2",
			name : "Jeff Page",
			twitter : "JeffPage",
			email : "jeffpage@gmail.com"

		}, function() {
			console.log("Successfully inserted joeblogs");
		});
	});
});
```

*output*
```bash
We are connected! 127.0.0.1:27017
We have the collection
Successfuly inserted KLVTZ
Successfully inserted joeblogs
```

Now what if we wanted to query the database and get an object? We copied our
`server.js` file and installed both express and the MongoDB. We added a function
called `getUser` with both user identifier and a callback function to process
the data that is returned. 

We make a new database reference to our previously queried database. We then
open the collection of user and use the collection object in the callback
function. We then use the method of `find` from the collection object. This will
accept the string parameter it is looking for. It will then use a closure
function that uses a cursor to navigate through the selection. We then convert
our first selection to an array of objects. We check to see if that array does
indeed have data inside. If the length of the array is zero, we understand that
the actual collection of users gathered with that identifier proves to not
exist. We send a boolean of `false` over to our provided callback. Else, if
there is data, we send through our first matched selection. By this method, we
have successfully queried MongoDB for persisted information. 

*query.js*
```javascript
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;


function getUser(id, callback) {
	var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
	db.open(function(error){
		console.log("We are connected! " + host + ":" + port);


		db.collection("user", function(error, collection) {
			console.log("We have the collection");

			collection.find({"id": id.toString()}, function(error, cursor) {
				cursor.toArray(function(error, users) {
					if(users.length == 0) {
						callback(false);
					} else {
						// returning one instance of users
						callback(users[0]);
					}
				});
			});
		});
	});
}

getUser(1, function(user) {
	if(!user) {
		console.log("No user found with id 1");
	} else {
		console.log("We have a user's twitter: ", user.twitter);
	}
});

getUser(2, function(user) {
	if(!user) {
		console.log("No user found with id 2");
	} else {
		console.log("We have a user's email: ", user.email);
	}
});

getUser("3", function(user) {
	if(!user) {
		console.log("No user found with id 3");
	} else {
		console.log("We have a user: ", user);
	}
});
```

*output*
```bash
We are connected! 127.0.0.1:27017
We have the collection
We are connected! 127.0.0.1:27017
We have the collection
We are connected! 127.0.0.1:27017
We have the collection
We have a user's twitter:  KLVTZ
We have a user's email:  joeblogs@gmail.com
No user found with id 3
```

Now let's combine the express framework and our recenty query for MongoDB into
one web request. That is, allowing us the ability to request a user identifier
to which is used to directly query our db and return an equal selection. By
calling our `getUser` function from within our `/user/:id` request. We are able
to grab the user data the second we request a proper identifier. By doing so, we
do complete a full request/response cycle that includes the persistance of data
from within MongoDB.

*server.js*
```javascript
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var express = require("express");

var mongo = require("mongodb");
var dbHost = "127.0.0.1";
var dbPort = mongo.Connection.DEFAULT_PORT;


var app = express();

app.get("/", function(request, response) {
	response.send("hello!");
});

app.get("/hello/:text", function(request, response) {
	response.send("Hello " + request.params.text);
});


app.get("/user/:id", function(request, response) {

	getUser(request.params.id, function(user){
		if(!user) {
			response.status(404).send("User does not exist.");
		} else {
			response.send("<a href='http://twitter.com/" + user.twitter + "' target='_blank'>Follow " + user.name + " on twitter</a>");
		}
	});
});


app.listen(port, host);


function getUser(id, callback) {
	var db = new mongo.Db("nodejs-introduction", new mongo.Server(dbHost, dbPort, {}), {safe: true});
	db.open(function(error){
		console.log("We are connected! " + dbHost + ":" + dbPort);


		db.collection("user", function(error, collection) {
			console.log("We have the collection");

			collection.find({"id": id.toString()}, function(error, cursor) {
				cursor.toArray(function(error, users) {
					if(users.length == 0) {
						callback(false);
					} else {
						// returning one instance of users
						callback(users[0]);
					}
				});
			});
		});
	});
}
```
