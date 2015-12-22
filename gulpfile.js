var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var gutil  = require('gulp-util');

// default task
gulp.task('default', ['coffee', 'content_scripts'], function () {
  gulp.watch('src/content_scripts/*.coffee', ['content_scripts']);
});

// compile coffee to js
gulp.task('coffee', function() {
  // return することで実行順序を保証
  return gulp.src('src/content_scripts/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('src/content_scripts/'));
});

// minify and concat content_scripts js
gulp.task('content_scripts', ['coffee'], function() {
  gulp
    .src([
      './node_modules/jquery/dist/jquery.min.js',
      './src/content_scripts/*.js',
    ])
    .pipe(uglify({
      preserveComments: 'license'
    }).on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/content_scripts'));
});
