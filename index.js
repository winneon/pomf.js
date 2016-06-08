"use strict";

require("console-stamp")(console, {
	pattern: "HH:MM:ss mmm/dd",
	colors: {
		stamp: "yellow",
		label: "grey"
	}
});

var config = require("./config");

require("./events").listen(config.port, () => {
	console.log(`Server started on port ${config.port}.`);
});

process.on("SIGINT", () => {
	console.log("Terminating.");
	process.exit(0);
});
