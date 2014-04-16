var fs = require("fs");
var express = require("express");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
var Twit = require('twit');

var name;
var users = [];
var cursor = -1;
var T = new Twit({
	consumer_key: '4wOVjAgqIzprfbs6ZWPVA',
	consumer_secret: 'bwhpE4b84tkbOeCSSUehMlzGOH2mylSwyTPsEvKFLo',
	access_token: '403864630-KN34V9PBD68JCgr3CQDMrkqA9PovkgvMcGLZCKuy',
	access_token_secret: '8zU7lfcbtSF5iO0ekVkou8wTzgl4z6xBYRGhaX9tUhiz5'
});

function getCurrentList(callback) {
	T.get('followers/list', {screen_name: "assassins4kids", cursor: cursor}, function(err, reply) {
		if(err) { console.log(err); }
		reply.users.forEach(function(user) {
			users.push({name: user.name});
		});
		callback(reply['next_cursor']);
	});
}

function getFollowers(callback) {
	getCurrentList(function(next_cursor) {
		cursor = next_cursor;
		callback(cursor);
	});
}

	getFollowers(function(cursor) {
		this.cursor = cursor;
	});


	getFollowers(function(cursor) {
		console.log(users);
	});




