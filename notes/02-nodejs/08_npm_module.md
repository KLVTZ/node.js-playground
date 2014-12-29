NPM Module
==========

We will be creating our very own module. By spliting our functionality into
separate parts, we can use them as models. 

To demonstrate this, let us create a `my_module.js` file to which we will
create a few functions. these functions have public and private methods.
We can then reference these functions through other files by referencing 
them as an object of the function reference. We treat the function as an 
exported function module called `hello`. By requiring the proper reference 
of our module, we are able to reference it and it's exported functions.


```javascript
function hello() {
	return "World";
}

function helloWorld() {
	return hello() + ' again';
}

function myPrivateFunction(number) {
	return number + 1;
}

function increment(number) {
	return myPrivateFunction(number)
}

// want a variable hello which is a reference
module.exports.helloWorld = hello;
module.exports.helloWorldAgain = helloWorld;
module.exports.increment = increment;
```

```javascript
// server.js
var myModule = require("./my_module.js");

console.log("Hello " + myModule.helloWorldAgain());

console.log("My number: " + myModule.increment(10));
```

Now let's take this concept and apply it to our very own custom github module.
In this second example, we create our previous functions of getting a user
repository through HTTPS. We register the module as an object reference of
`getRepos`. We then reference this function through our `github` module. We
provide the default username and callback function to process the data that is
sent back. The call back function will console log our returned array-collection
of repo objects.

*server.js*
```javascript
var github = require("./github.js");

github.getRepos("KLVTZ", function(repos){
	console.log("Justin Page", repos);
});
```

*github.js*
```javascript
var https = require("https");

function getRepos(username, callback) {

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

module.exports.getRepos = getRepos;
```
