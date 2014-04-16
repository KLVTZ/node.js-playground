// need to do it before anything else
var content = fs.readFileSync('/path/to/file');

// asynchrous writing.
fs.writeFile('/path/to/file', 'content', function(){

});