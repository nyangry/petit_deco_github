const gulp   = require('gulp');
const concat = require('gulp-concat');

// default task
gulp.task('default', ['dist_js'], () => {
  gulp.watch('src/content_scripts/*.js', ['dist_js']);
});

// minify and concat content_scripts js
gulp.task('dist_js', () => {
  gulp
    .src([
      './src/content_scripts/*.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/content_scripts'));
});
