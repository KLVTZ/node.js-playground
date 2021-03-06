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
