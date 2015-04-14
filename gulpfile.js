var gulp = require('gulp'),
    watch = require('gulp-watch'),
    nodemon = require('gulp-nodemon'),
    traceur = require('gulp-traceur'),
    concat = require('gulp-concat');

gulp.task('default', function() {
	nodemon({
		script: 'server.js', 
		ext: 'js html', 
		env: { 'NODE_ENV': 'development' }
	}).on('restart', function () {
      console.log('restarted!')
    });

    gulp.task('default', function () {
	    return gulp.src('scripts/*.js')
	        .pipe(traceur())
	        .pipe(gulp.dest('dist'));
	});

	gulp.task('compress', function() {
		return gulp.src('dist/*.js')
			.pipe(uglify({
				mangle: false
			}))
			.pipe(gulp.dest('public'));
	});

	gulp.task('scripts', function() {
		return gulp.src('dist/*.js')
			.pipe(concat('script.js'))
			.pipe(gulp.dest('public'));
	});
});