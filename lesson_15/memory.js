// a random object
var object = {
	foo : 'bar',
	joe : 'blogs',
	ollie : {
		twitter: "@ollieparsley",
		url: "http://ollieparsley.com"
	}
};

// remove ollie
object.ollie = null // frees up memory
delete object.ollie;