// begin: app-fog mongodb init
if(process.env.VCAP_SERVICES){
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
	var mongo = {
		"hostname":"localhost",
		"port":27017,
		"username":"",
		"password":"",
		"name":"",
		"db":"db"
	}
}

var generate_mongo_url = function(obj){
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'test');

	if(obj.username && obj.password){
		return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
	else{
		return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
	}
}
// end: app-fog mongodb init

var mongourl = generate_mongo_url(mongo);

// bring in your env variables
require('dot-env');

var fs = require("fs");
var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('twitter');
var config = JSON.parse(fs.readFileSync('config.json'));
var port = (process.env.VMC_APP_PORT || config.port);
var host = (process.env.VCAP_APP_HOST || config.host);

// oauth for twitter api
var twit = new twitter({
	consumer_key: process.env.CONSUMER_KEY, 
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET 
});

var tweetCollection;

// database inclusion
var mongo = require("mongodb").connect(mongourl, function(err, db) {
	if (err) console.log(err);

	console.log("Mongo is connected! " + host + ":" + port);

	db.collection("tweet", function(error, collection){
		tweetCollection = collection;
	});
});

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

http.listen(port, function() {
	console.log("listening on *:3000");
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
