// process.argv[0] => node /
// process.argv[1] => twitter.js
var keyword = process.argv[2];

// each launch contains consumer ke
var consumerKey = process.argv[3];
var consumerSecret = process.argv[4];
var accessTokenKey = process.argv[5];
var accessTokenSecret = process.argv[6];

var tweetCount = 0;

setInterval(function() {
	process.send(tweetCount + " tweets");
}, 2000);

var twitter = require('ntwitter');

// oAuth for twitter API v1.1
var twit = new twitter({
	consumer_key: consumerKey,
	consumer_secret: consumerSecret,
	access_token_key: accessTokenKey,
	access_token_secret: accessTokenSecret
});

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;
db.open(function(error){

	db.collection("tweet", function(error, collection){
		tweetCollection = collection;
	});

});

// each stream of JSON tweet is inserted into mongo DB -
// twitter API v1.1 is JSON default -no need to parse
twit.stream('statuses/filter', {track: keyword}, function(stream) {
	stream.on('data', function(tweet) {
		tweet.keyword = keyword;
		tweetCount++;
		tweetCollection.insert(tweet, function(error) {
			if(error) {
				console.log("Error: ", error.message);
			}
		});
	});
});
