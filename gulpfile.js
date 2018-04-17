var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gutil  = require('gulp-util');

// default task
gulp.task('default', ['dist_js'], function () {
  gulp.watch('src/content_scripts/*.js', ['dist_js']);
});

// minify and concat content_scripts js
gulp.task('dist_js', function() {
  gulp
    .src([
      './src/content_scripts/*.js',
    ])
    .pipe(uglify({
      preserveComments: 'license'
    }).on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/content_scripts'));
});
