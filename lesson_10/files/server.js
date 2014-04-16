var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var express = require("express");

var mongo = require("mongodb");
var dbHost = "127.0.0.1";
var dbPort = mongo.Connection.DEFAULT_PORT;


var app = express();

app.use(app.router);
app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response) {
	response.send("hello!");
});

app.get("/hello/:text", function(request, response) {
	response.send("Hello " + request.params.text);
});


app.get("/user/:id", function(request, response) {

	getUser(request.params.id, function(user){
		if(!user) {
			response.send("User does not exist", 404);
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