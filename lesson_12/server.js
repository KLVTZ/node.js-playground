// bring in your env variables
require('dot-env');

var fs = require("fs");
var express = require("express");

var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;

var twitter = require('twitter');

// oauth for twitter api
var twit = new twitter({
	consumer_key: process.env.CONSUMER_KEY, 
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET 
});


var app = express(),
	server = app.listen(port),
	io = require('socket.io').listen(server);

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;

app.get("/", function(request, response) {
	var content = fs.readFileSync("template.html");

	getTweets(function(tweets) {
		var ul = '';
		tweets.forEach(function(tweet) {
			ul += "<li><strong>" + tweet.user.screen_name + ": </strong>" + tweet.text + "</li>";
		});
		content = content.toString("utf8").replace("{{INITIAL_TWEETS}}", ul);
		response.setHeader("Content-Type", "text/html");
		response.send(content);
	});
});

server.listen(port, host);

db.open(function(error){
	console.log("Mongo is connected! " + host + ":" + port);

	db.collection("tweet", function(error, collection){
		tweetCollection = collection;
	});

});

function getTweets(callback) {
	tweetCollection.find({}, {"limit":10, "sort":{"_id": -1}}, function(error, cursor) {
		cursor.toArray(function(error, tweets) {
			callback(tweets);
		});
	});
}

twit.stream('statuses/filter', {track: 'bieber'}, function(stream) {
	stream.on('data', function(tweet) {

		// send out the tweet to the template page
		io.sockets.emit("tweet", tweet);

		tweetCollection.insert(tweet, function(error) {
			if(error) {
				console.log("Error: ", error.message);
			} else {
				console.log("Inserted into database");
			}
		});
	});
});
