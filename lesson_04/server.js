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
