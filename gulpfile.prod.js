var common = require('./gulpfile.common.js');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');

gulp.task('css:minify', ['css:concat'], function() {
    return gulp.src('./static/main.css')
               .pipe(cssnano())
               .pipe(gulp.dest('./static'));
});

gulp.task('default', ['css:minify']);

