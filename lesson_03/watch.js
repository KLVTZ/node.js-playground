var fs = require("fs");
console.log("Started");
var config = JSON.parse(fs.readFileSync("config.json"));
console.log("Initial Config: ", config);

// watch file when updated
fs.watchFile("config.json", function(current, previous) {
	console.log("config changed");
	config = JSON.parse(fs.readFileSync("config.json"));
	console.log("New config file: ", config);
});