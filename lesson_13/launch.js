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
