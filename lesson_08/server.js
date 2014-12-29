// var myModule = require("./my_module.js");

// console.log("Hello " + myModule.helloWorldAgain());

// console.log("My number: " + myModule.increment(10));

var github = require("./github.js");

github.getRepos("KLVTZ", function(repos){
	console.log("Justin Page", repos);
});
