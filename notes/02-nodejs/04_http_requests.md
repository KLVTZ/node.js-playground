HTTP Requests
=============
> We are going to listen on a port, receive an HTTP request, send a response, and
load a bit off of a routine while sending some files.

We assigned an HTTP variable that requires the HTTP library through node. We
then assign a host and a port --the host is default and the port can be defined.
The server is then created with two parameter data arguments. If a user requests
a defined URL, then a response will be sent. We `console.log` our request object
URL. We then write to our head with a response of end, which happens to say
`"Hello World"`. We also demonstrate that we are listening to the port and host
with a callback function which reports it is listening.

```javascript
var http = require("http");
console.log("Starting");
var host = '127.0.0.1';
var port =  1337;


// request contains info on the URL and header info. 
//The response is where we send the response this will send to the client
var server = http.createServer(function(request, response) {
	console.log("Recieved request: " + request.url);
	response.writeHead(200, {"Content-type":"text/html"});
	response.end("<h1>Hello World!</h1>");
});

server.listen(port, host, function() {
	console.log("Listening " + host + ":" + port);
});
```

Our second example adds upon what we have learned thus far. We will still call
our HTTP as a required variable. But, in addition, we will require a file read
system. This file read system will be required to parse JSON configuration. This
data contains both host and port settings. We then create a read file system
inside our previous server. We read the file inside the public in addition to
the requested URL. We will call a function that allows us to grab the data or an
error as the request is processed. If there is an error, we will output the
error in plain text as our response. Else, we will write our data with a
successful `200` message. We return the data within the response. 


*config*
```javascript
{
	"port" : 1337,
	"host" : "127.0.0.1"
}
```

```javascript
var http = require("http");
var fs = require("fs");
console.log("Starting");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;


// request contains info on the URL and header info. 
//The response is where we send the response this will send to the client
var server = http.createServer(function(request, response) {
	console.log("Recieved request: " + request.url);
	fs.readFile("./public" + request.url, function(error, data) {
		if(error) {
			response.writeHead(404, {"Content-type":"text/plain"});
			response.end("Sorry the page was not found");
		} else {
				response.writeHead(200, {"Content-type":"text/html"});
				response.end(data);
		}
	})
});

server.listen(port, host, function() {
	console.log("Listening " + host + ":" + port);
});
```

We have demonstrated the listening server which will run as we listen for the
request and serve a response. Note how we call a watch on a file. This will
watch the `config.json`. Every time we change the contents of the file, we will
parse through the data, close the current server connection, and listen onto a
new server connection with the updated host and port information.

```javascript
// continuously listens onto server
fs.watchFile("config.json", function() {
	config = JSON.parse(fs.readFileSync("config.json"));
	server.close(); 
	host = config.host;
	port = config.port;
	server.listen(port, host, function() {
		console.log("Now Listening to " + host + ":" + port);
	});
});
```
