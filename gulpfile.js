var gulp = require('gulp');
var watch = require('gulp-watch');
var react = require('gulp-react');
var insert = require('gulp-insert');
var changed = require('gulp-changed');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');
var concatCSS = require('gulp-concat-css');
var livereload = require('gulp-livereload');
var browserify = require('gulp-browserify');
var reactDomPragma = require('react-dom-pragma');

gulp.task('default', ['main', 'view', 'mixin', 'browserify', 'minify-css', 'watch']);

gulp.task('main', function () {
  return handleJSX(['assets/main.js', 'assets/api.js'], 'tmp/assets');
});

gulp.task('view', function () {
  return handleJSX('assets/view/**.js', 'tmp/assets/view');
});

gulp.task('mixin', function () {
  return gulp.src('assets/mixin/**/*.js')
    .pipe(gulp.dest('./tmp/assets/mixin'));
});

gulp.task('browserify', function() {
  return gulp.src('tmp/assets/main.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .pipe(gulp.dest('./build/assets'));
});

gulp.task('minify-css', function() {
  gulp.src('assets/view/*.css')
    .pipe(concatCSS("App.css"))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('build/assets'))
});

gulp.task('sequence', function() {
  runSequence('main', 'view', 'mixin', 'browserify');
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('assets/**/*.js', ['sequence']);
  gulp.watch('assets/**/*.css', ['minify-css']);
  gulp.watch('build/**/*.js').on('change', livereload.changed);
});

function handleJSX(files, output) {
  return gulp.src(files)
    .pipe(insert.transform(function(contents) {
      return reactDomPragma(contents);
    }))
    .pipe(react())
    .pipe(changed(output, {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest(output));
}