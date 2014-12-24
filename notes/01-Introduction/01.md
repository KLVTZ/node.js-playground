Introduction
============
We will take the knowledge of coding for the browser and implement them into
server development. Node is ran on JavaScript runtime environment. We will
cover topics, such as accessing file systems, databases, APIs, Web Servers, and
Web Sockets. Node is built on Google Chrome's V8 Engine. Because of this, the
change of JavaScript code for the back end development is not that much
different. Node contains a process object, single threads, and time set
intervals for full customization.

In our example, we took a look at one of the biggest differences between PHP and
node when running a process while another process waits to finish. Node allows
us to run multiple processes at once. PHP, on the other hand, cannot. It has to
wait until it reads the file and process its contents before continuing on
it's execution cycle.

```javascript
<?php

echo "Starting\n";
$contents = file_get_contents("sample.txt"); 
echo "Contents of file: {$contents}";
echo "Finished. Carry on executing...\n";
```

Output:
```bash
$ php sample.php
Starting
Contents of file: This is a sample file.  This is a sample file.  This is a
sample file.  This is a sample file.  This is a sample file.  This is a sample
file.  This is a sample file.  This is a sample file.  This is a sample file.
This is a sample file.  This is a sample file.
Finished. Carry on executing...
```

And if we do the same, but with node:
```javascript
var fs = require("fs");
console.log("Starting");
fs.readFile("sample.txt", function(error, data) {
	console.log("Contents of file " + data);
});
console.log("Carry on executing");
```

Output:
```bash
$ node sample.js
Starting
Carry on executing
Contents of file This is a sample file.  This is a sample file.  This is a
sample file.  This is a sample file.  This is a sample file.  This is a sample
file.  This is a sample file.  This is a sample file.  This is a sample file.
This is a sample file.  This is a sample file.
```
