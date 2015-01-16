Child Process
=============

> Child process allows us to stream data through a tri-directional facility.

We are going to create a launch script that will store tweets in our database
and then kill the children when we collect our tweets.

We create a launcher file, `launch.js` that will first import the child process
object. We then create an empty array of children. We then create a keywords
array that houses a sub-array of items. We insert both items as a means of a
process. Each sub-array contains both the keyword and necessary authentication
to interact with twitter. We then call a for-each loop that will grab the
keyword data and store each instance of the data into a child process forked
object. We call a fork based on the keyword data. the child process keyword will
then use the command arguments passed through as the sub-array that can hold
data between the session of both the launch and twitter script file. Thus, we
can then push each child message on the children array. This will keep track of
our children instances. We provide an exit message event for when we exit the
processes and must kill each child. We also provide an event messanger that
will report back every message that is sent through each process.

```javascript
var childProcess = require("child_process");

var children = [];

// insert ntwitter creds
var keywords = [
	["bieber", "", "",
	 "", ""],
	["obama", "", "",
	 "", ""]
];

keywords.forEach(function(keywordData) {
	var child = childProcess.fork(__dirname + "/twitter.js", keywordData);
	child.on("exit", function() {
		console.log(keywordData[0] + ": died :(");
	});
	child.on("message", function(text) {
		console.log(keywordData[0] + ": " + text);
	})
	children.push(child);
});

process.on("exit", function() {
	children.forEach(function(child) {
		child.kill();
	})
});
```

Our `twitter.js` is the same but it includes assignment variables from the
process array that will assign the proper keys and variables for our use within
that child. We then set an interval that will send a message to the process to
which will then be grabbed by the child process object of fork. We use the
environment variables inside our initialization of the twitter object. We also
use the keyword assignment to have access to the keyword and increment the
count.

```bash
bieber: 113 tweets
obama: 69 tweets
```
