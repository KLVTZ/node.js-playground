Asynchronous and synchronous file read
======================================

Node provides a File System library that allows you to read from a file, write
to a file, load from a file, and even pause or watch a file. In our first
example, we are using asynchronous. That means the file system will continue
with its process while handling another asynchronously. 

The `fs.readFile()` method reads a file asynchronously whereas `fs.readFileSync()`
reads a file synchronously. Asynchronously reads means the file system will
continue with its process while handling another at the same time. A synchronous
process must first process the file before moving onto the next.

```javascript
// asynchronous version is perhaps the most useful]
// synchronise may want to be used if a file needs to be read before anything can happen.
var fs = require("fs");
console.log("Starting");
var content = fs.readFileSync("sample.txt");
console.log("Contents: " + content);
console.log("Carry on executing");
```

To write a file asynchronously, we call `fs.writeFile()`. We include the source
data and the call back function for success or failure:

```javascript
// writing a file
var fs = require("fs");
console.log("Starting");
fs.writeFile("write_sync.txt", "Hello, World!", function(error) {
	console.log("Written file");
});
console.log("Finished!");
// Starting
// Finished!
// Written file
```

To wait for a file and process it, we call the command `fs.readFileSync()` and
then parse the contents by `JSON.parse(contents)`, which returns the object file
into a config. We can output the config or console log a property of the config
object.  

```javascript
var fs = require("fs");
console.log("Starting");

var contents = fs.readFileSync("config.json");
console.log("Contents: " + contents);

var config = JSON.parse(contents);
console.log("Config: ", config);
console.log("Username: ", config.username);
```

Output:
```bash
Starting
Contents: {
	"username" : "justin",
	"api_key" : "page",
	"name" : "Justin Page",
	"version" : 5
}
Config:  { username: 'justin',
	api_key: 'page',
    name: 'Justin Page',
    version: 5 }
Username:  justin
```
