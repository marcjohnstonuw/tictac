var gulp = require('gulp'),
    watch = require('gulp-watch'),
    nodemon = require('gulp-nodemon'),
    traceur = require('gulp-traceur'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');




gulp.task('traceur-runtime', function() {
	return gulp.src([
			traceur.RUNTIME_PATH,
		])
		.pipe(gulp.dest('public'));
});

gulp.task('scripts', ['traceur-runtime'], function() {
	return gulp.src([
			'scripts/*.js'
		])
        .pipe(traceur({modules:'inline'}))
		/*.pipe(uglify({
			mangle: false
		}))*/
		.pipe(concat('out.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('public', ['scripts'], function () {
	return gulp.src('dist/out.js')
		.pipe(gulp.dest('public'))
})

gulp.task('nodemon', ['public'], function () {
	nodemon({
		script: 'server.js', 
		ext: 'js html', 
		env: { 'NODE_ENV': 'development' }
	}).on('restart', function () {
      console.log('restarted!')
    });
})

gulp.task('watch', function () {
	gulp.watch('scripts/*.js', ['default']);
	gulp.watch('server.js', ['default']);
})

gulp.task('default', function () {
	gulp.start('scripts', 'traceur-runtime', 'public', 'nodemon', 'watch')
	/*
    return gulp.src('scripts/*.js')
        .pipe(traceur())
        .pipe(compress())
        .pipe(scripts())
        .pipe(gulp.dest('dist'));
        */
});