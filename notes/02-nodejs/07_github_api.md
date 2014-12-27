Github API
==========
In this lesson, we will be interacting with Github's API. This API allows us to
see a users data. Such as their repositories and other useful tidbits. In our
particular example, we will be be totaling the number of repositories in each
user's account. This can include the listing of both the name and the description of a
repository and then display the total length or entries.

To do this, we need to take advantage of node's `https` module for secure HTTP
request. We then create a function that will get our repository data on each
user we request. There are two parameter arguments. The first is a username and
the other is a callback function to which we will use once we process our data.

We build the JSON object variable with the body of data that is returned from
response. Our HTTP request allows us to define when we receive chunks of data
and when the receive of those chunks end. As such, we are able to
concatenate each chunk as a string.

When the response is done, we trigger our end response. The function that is
dedicated to this reaction will build an array of objects. This object will go
through each JSON parsed chunk that we created in our body variable. We go
through each chunk and push the data onto the array stack. Once all our JSON
entries are processed, we initiate our callback function with our repos array.

Each callback function will be dedicated to logging the number of repos each
user has. I've also included an example of listing the name of all repos on a
user account.

```javascript
var https = require("https");

var getRepos = function(username, callback) {

	var options = {
		host : "api.github.com",
		path : "/users/" + username + "/repos",
		method : "GET",
		headers: {'user-agent': 'node.js'}
	};

	var request = https.request(options,function(response) {
		var body = '';
		response.on("data", function(chunk) {
			body += chunk.toString('utf8');
		});
		response.on("end", function() {
			var repos = [];
			var json = JSON.parse(body);
			json.forEach(function(repo) {
				repos.push({
					name : repo.name,
					description : repo.description
				});
			});
			callback(repos);
		});
	});

	request.end();
}

getRepos("KLVTZ", function(repos) {
	console.log("Justin Page has " + repos.length + " repos");
	repos.forEach(function(repo) {
		console.log("Name: " + repo.name);
	});
});

getRepos("OllieParsley", function(repos) {
	console.log("Ollie Parsley has " + repos.length + " repos");
});

getRepos("JeffreyWay", function(repos) {
	console.log("Jeffrey Way has " + repos.length + " repos");
});
```
