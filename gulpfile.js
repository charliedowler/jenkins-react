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

gulp.task('default', ['main', 'view', 'mixin', 'model', 'collection', 'browserify', 'minify-css', 'watch']);

gulp.task('main', function () {
  return handleJSX(['assets/main.js', 'assets/api.js', 'assets/bus.js'], 'tmp/assets');
});

gulp.task('view', function () {
  return handleJSX('assets/view/**/*.js', 'tmp/assets/view');
});

gulp.task('model', function () {
  return gulp.src('assets/model/**/*.js')
    .pipe(gulp.dest('./tmp/assets/model'));
});

gulp.task('collection', function () {
  return gulp.src('assets/collection/**/*.js')
    .pipe(gulp.dest('./tmp/assets/collection'));
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
    .pipe(gulp.dest('./server/public/javascripts'));
});

gulp.task('minify-css', function() {
  gulp.src('assets/view/*.css')
    .pipe(concatCSS("App.css"))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('server/public/stylesheets'));
});

gulp.task('sequence', function() {
  runSequence('main', 'view', 'mixin', 'model', 'collection', 'browserify');
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('assets/**/*.js', ['sequence']);
  gulp.watch('assets/**/*.css', ['minify-css']);
  gulp.watch('server/public/**/*').on('change', livereload.changed);
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
