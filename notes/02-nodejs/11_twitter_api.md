Twitter API
===========
We are going to connect to the twitter streaming API, collect tweets, and insert
them into mongo.

In order to do this, we must first implement our `twitter` module. We create a
new instance of the twitter library with our twitter API keys as parameter.
Notice we are taking advantage of environment variables. By using the `env`
module, we can bring in secure keys into our application without compromising
their privacy. We open a connection that creates a collection of tweets. The
collection of tweets is then assigned to a global variable called
`tweetCollection`. This allows us access to the collection object outside
the newly created instance reference of the database.

We then call the method property of `stream` from the `Twitter` object. The
`stream` method requires three parameters: a method to which we like to use the
streaming API, the parameters to which we like to track, and a callback function
that will process the stream itself. Each instance of data that is received will 
be inserted into the collection. If anything fails, we log the error. 

Stream ends after four seconds.
```javascript
// bring in your env variables
require('dot-env');

var twitter = require('twitter');

// oauth for twitter api
var twit = new twitter({
	consumer_key: process.env.CONSUMER_KEY, 
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET 
});

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;

// start the connection to mongodb
db.open(function(error){
	console.log("We are connected! " + host + ":" + port);

	db.collection("tweet", function(error, collection){
		// tweet collection reference is in global scope
		tweetCollection = collection;
	});

});

// each stream of JSON tweet is inserted into mongo DB -
twit.stream('statuses/filter', {track: 'bieber'}, function(stream) {
	stream.on('data', function(tweet) {
		tweetCollection.insert(tweet, function(error) {
			if(error) {
				console.log("Error: ", error.message);
			} else {
				console.log("Inserted into database");
			}
		});
		setTimeout(stream.destroy, 4000);
	});
});
```
