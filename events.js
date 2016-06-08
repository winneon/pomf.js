"use strict";

var express = require("express"),
    http    = require("http");

module.exports = (function(){
	var app = express();
	var server = http.Server(app);

	return server;
})();
