// writing a file
var fs = require("fs");
console.log("Starting");
fs.writeFile("write_sync.txt", "Hello, World!", function(error) {
	console.log("Written file");
});
console.log("Finished!");