require('dot-env');
var childProcess = require("child_process");

var children = [];

// insert ntwitter creds
var keywords = [
	["bieber", process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET,
	 process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET],
	["obama", process.env.OCONSUMER_KEY, process.env.OCONSUMER_SECRET,
	 process.env.OACCESS_TOKEN, process.env.OACCESS_TOKEN_SECRET],
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
