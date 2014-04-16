var fs = require("fs");
console.log("Starting");
fs.readFile("sample.txt", function(error, data) {
	console.log("Contents of file: " + data);	
});

console.log("Carry on executing");

