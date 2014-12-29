NPM module share
================
We can create our very own packages and share them with the community. To start
our very own module, we first need to create a `package.json` file for
information about our module.

```javascript
{
  "name": "justin-github-example",
  "version": "1.0.1",
  "description": "Get a list of github user repos",
  "main": "github.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Justin Page",
  "license": "BSD-2-Clause"
}
```

Afterwarsd, we initialize our package by calling `npm init`A. This will ask for
basic information that we will incude on the CLI. We must register ourselves as
a user. To do this, we `npm adduser`. Once the account has been added, we can
register it.

To publish our files, we `npm publish`. NPM publish will allow the user to
publish their results on their own npm. 

To pull the module, we `npm install justin-github-example`. We can then
associate our node through requiring the file. To update, `npm publish`. 
