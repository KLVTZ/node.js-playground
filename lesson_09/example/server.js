var github = require("justin-github-example");

github.getRepos("KLVTZ", function(repos) {
	console.log("Justin repos: ", repos.length);
});
