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
			name : "Joe Blogs",
			twitter : "joeblogs",
			email : "joeblogs@gmail.com"

		}, function() {
			console.log("Successfully inserted joeblogs");
		});
	});
});
