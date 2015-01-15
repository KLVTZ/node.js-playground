Socket IO
=========
> Example using express, mongodb, twitter, and socket.io

With the addition of [socket.io](https://socket.io), we are going to cover the
concepts behind setting up a web server, collecting tweets, sending those tweets
to the browser, and persisting them in our database.

Let's first discuss our template. We will be using double handlebars for our
templating. By using regular expressions, we can substitute our template
placeholders with the relevant data. Take note that our socket.io framework is
inserted into the header of the DOM. Within our main script, we indicate what
socket we like to connect to --this involves both our server address and port.
We then grab the unordered list from the DOM and then add it to a variable. When
the socket receives an emission of tweet data, we process the tweets into a list
from within our callback. This list will contain the tweet's username as well as
tweet's text. We insert this list before the latest tweet on the stack list. By doing
so, we are always listing the latest tweets.

```html
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Real-time bieber tweets</title>
	<script src="/socket.io/socket.io.js"></script>
</head>
<body>
	<h1>Real-time bieber tweets</h1>
	<ul id="tweets">
		{{INITIAL_TWEETS}}
	</ul>

	<script type="text/javascript">
		var socket = io.connect('http://127.0.0.1:1337');
		var ul = document.getElementById("tweets");
		socket.on('tweet', function (tweet) {
			var li = document.createElement("li");
			li.innerHTML = "<strong>" + tweet.user.screen_name + ": </strong> " + tweet.text;
			ul.insertBefore(li, ul.getElementsByTagName("li")[0]);
		});
	</script>
</body>
</html>
```

Next, we will pull in a few modules:
- dot-env: for our ENV variables
- fs: for reading our configurations
- twitter: for grabbing live tweets
- express: for handling our HTTP Requests
- mongodb: for persisting the latest tweets

The first thing we do is require our environment variables plugin. By doing so,
we don't have to specify ENV variables that are meant to be private. All we need
to do is create a `.env.json` file in order to load our secret API credentials
into the user's environment. We then require our file read and express
framework. We then parse through our configuration into JSON for our host and
port assignment. We then require the twitter module for streaming data from
their API. We then create a new twitter object with our API credentials via the
user's environment. We then create a new express object that will automatically
handle our HTTP request. However, for socket.io to work properly, we provide the
server that our express framework is listening to.

```javascript
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
```

Looking at our `get` method, we grab the index request and provide a response.
We grab the current contents of our template file. We then call `getTweets()`
and provide a callback to handle the tweets that we receive. Let's take a look
at our `getTweets()` method.

```javascript
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
```

The method uses the global reference of our mongodb collection. This collection
is referenced earlier as a tweet collection. This tweet collection is created
when we open our database connection and create a tweet collection. We assign a
reference of this collection to `tweetCollection`.

In our twitter stream, which happens asynchronously, or as blocks of data come
in, we filter for `bieber` and emit the results. On a stream result, we grab the
tweet object and insert them into the current collection. Now, going back to the
`getTweets()`, we use the find method onto our onto our collection. We parse
through 10 tweets, ascending order, and then convert our cursor to an array. That
array contains our tweets and therefore is passed to our callback.

```javascript
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
```

Our callback will process each tweet that is returned from our database. For
each element, we append it to a unordered list element. With each tweet, we
render a list item that contains the screen name and textual information that
each tweet has. We then replace our template, with the unordered list that has
been created. For example, the ten tweets we have in our database will then
replace the handlebars template. We set the proper headers for browser reference
and then send our content to be rendered onto the browser.

```javascript
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
```

Remember, in our stream, we call a socket emit. That is where we actually send
the data for new objects to render live on our app. In other words,

Complete sample application
===========================
```javascript
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
```
