Tips and Tricks
===============

In this final lesson, we cover tips and tricks for handling errors and problems
in solving situations you may uncover while working with node.

Our first tip is regarding the deletion of objects. It is best to set an object
to null and then call delete. This will free our memory and thus allow a user
inside an object to be completely deleted.

```javascript
// a random object
var object = {
	foo : 'bar',
	joe : 'blogs',
	ollie : {
		twitter: "@KLVTZ",
		url: "http://justinpage.me/"
	}
};

object.ollie = null // remove ollie
console.log(object);
delete object.ollie; // frees up memory
console.log(object);
```

Our next tip is to allow our objects to have a `.on()` listener for objects.
This can be responsible for catching an error and not prematurely ending our
application. This is important because node will stop a program from running, if
it has an error that no callback is available to use.

```javascript
someObject.on("message", function(text) {
	console.log("Message: " + text);
});
someObject.on("error", function(error) {
	console.log("Error: ", error.stack);
});
```
Sometimes we may have uncaught exceptions. We can apply this to the process
object. This will check on the uncaught exceptions to which we will log to the
error stack. Use error stack to check the exact trace of the uncaught exception.

```javascript
process.on("uncaughtException", function(error) {
	console.log("Error: ", error.stack);
});
```

To remove a listener, we do so by reference of a named function (not an
anonymous function) from within the listener scope. We can also add reference
for a listener. We can also remove all listeners from our objects to reclaim
some additional space.

```javascript
// Normal event listener
var doSomething = function() {
	console.log("Something Happend");
}
someObject.on("something", doSomething);

someObject.removeListener("something", doSomething);
someObject.addListener("something", doSomething);

// useful for reclaiming some memory.
someObject.removeAllListeners();
```

Finally, use common sense with asynchronous and synchronous requests. When we
want to read a file and need results, use a file sync request. If we want to
write to a file, then asynchronous is the way to go --don't have to wait for
other process to finish while other continue.

```javascript
// need to do it before anything else
var content = fs.readFileSync('/path/to/file');

// asynchrous writing.
fs.writeFile('/path/to/file', 'content', function(){

});
```
