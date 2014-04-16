// asynchronous version is perhaps the most useful]
// synchronise may want to be used if a file needs to be read before anything can happen.
var fs = require("fs");
console.log("Starting");
var content = fs.readFileSync("sample.txt");
console.log("Contents: " + content);
console.log("Carry on executing");
