"use strict";

var express = require("express"),
    parser  = require("body-parser"),
    multer  = require("multer"),
    crypto  = require("crypto"),
    http    = require("http"),
    path    = require("path"),
    fs      = require("fs");

var config = require("./config");
var serve = require("./serve");

module.exports = (function(){
	var app = express();
	var server = http.Server(app);

	var upload = multer({
		storage: multer.diskStorage({
			destination: path.join(__dirname, "uploads"),
			filename: function(req, file, callback){
				try {
					var name = "";

					do {
						name = crypto.randomBytes(3).toString("hex") + path.extname(file.originalname);
					} while (name == "" || fs.existsSync(path.join(__dirname, "uploads", name)));

					callback(null, name);
				} catch (error){
					callback(error);
				}
			}
		})
	});

	app.set("trust proxy", "loopback");
	app.set("view engine", "pug");
	app.set("views", path.join(__dirname, "static"));

	app.use(parser.urlencoded({ extended: true }));
	app.use(parser.json());

	app.use(express.static(app.get("views")));

	app.post("/upload", upload.single("upload"), (req, res) => {
		if (req.file){
			if (req.file.size > (config.limit * 1024 * 1024)){
				fs.unlinkSync(req.file.path);
				res.status(413).end();
			} else {
				res.status(200).send(config.host.replace(/\/+$/, "") + "/" + req.file.filename);
			}
		} else {
			res.status(400).end();
		}
	});

	app.use(serve);

	return server;
})();
