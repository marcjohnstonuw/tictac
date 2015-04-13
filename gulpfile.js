var gulp = require('gulp'),
    watch = require('gulp-watch'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {
	nodemon({
		script: 'server.js', 
		ext: 'js html', 
		env: { 'NODE_ENV': 'development' }
	}).on('restart', function () {
      console.log('restarted!')
    })
});