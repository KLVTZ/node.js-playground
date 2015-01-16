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
