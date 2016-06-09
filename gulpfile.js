var gulp    = require("gulp"),
    nodemon = require("gulp-nodemon"),
    sass    = require("gulp-sass");

gulp.task("sass", () => {
	return gulp.src("common/sass/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("common/static/css/"));
});

gulp.task("sass:watch", () => {
	gulp.watch("common/sass/**/*.scss", [ "sass" ]);
});

gulp.task("server", () => {
	nodemon({
		script: "common/index.js",
		watch: "common"
	});
});

gulp.task("default", [ "sass:watch", "server" ]);
