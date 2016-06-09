"use strict";

require("console-stamp")(console, {
	pattern: "HH:MM:ss mmm/dd",
	metadata: "[shows.js]",
	colors: {
		stamp: "yellow",
		label: "grey",
		metadata: "green"
	}
});

var config = require("./config");

require("./events").listen(config.port, () => {
	console.log(`Server started on port ${config.port}.`);
});
