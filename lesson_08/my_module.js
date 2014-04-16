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
