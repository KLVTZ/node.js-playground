// Normal event listener
var doSomething = function() {
	console.log("Something Happend");
}
someObject.on("something", doSomething);

someObject.removeListener("something", doSomething);
someObject.addListener("something", doSomething);

// useful for reclaiming some memory.
someObject.removeAllListeners();