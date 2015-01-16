// a random object
var object = {
	foo : 'bar',
	joe : 'blogs',
	ollie : {
		twitter: "@ollieparsley",
		url: "http://ollieparsley.com"
	}
};

object.ollie = null // remove ollie
console.log(object);
delete object.ollie; // frees up memory
console.log(object);
