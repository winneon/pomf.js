"use strict";

var fs   = require("fs"),
    path = require("path");

var config = require("./config");

module.exports = function(req, res, next){
	if (config.frontend){
		res.locals.basedir = req.app.get("views");
		res.locals.limit = config.limit;

// i'm sorry for breaking code style ;_;
res.locals.config = `{
	"Name": "pomf.js",
	"RequestType": "POST",
	"RequestURL": "` + config.host.replace(/\/+$/, "") + `/upload",
	"FileFormName": "upload",
	"ResponseType": "Text"
}`;

		if (req.query && req.query.message){
			res.locals.message = req.query.message;
		}

		var file = res.path;

		if (!file){
			file = req.path == "/" ? "/index" : req.path;
		}

		file = file.substring(1, file.substring(file.length - 1, file.length) == "/" ? file.length - 1 : file.length);

		if (fs.existsSync(path.join(req.app.get("views"), file))){
			res.end();
		} else if (fs.existsSync(path.join(__dirname, "uploads", file))){
			res.sendFile(path.join(__dirname, "uploads", file), (error) => {
				if (error){
					console.error(error);
				}
			});
		} else {
			if (fs.existsSync(path.join(req.app.get("views"), file + ".pug"))){
				res.render(file, function(error, html){
					if (error){
						res.end();
						console.log(error);
					} else {
						res.send(html);
					}
				});
			} else {
				res.redirect("/");
			}
		}
	} else {
		res.sendStatus(404);
	}
};
