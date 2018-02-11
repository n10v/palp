var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp = require('gulp');

gulp.task('css:concat', function() {
    return gulp.src([
                      './view/css/normalize.css',
                      './view/css/blueprint.css',
                      './view/css/highlight.css',
                      './view/css/base.css',
                      './view/components/**/*.css',
                      './view/pages/**/*.css'
                    ])
               .pipe(concat('main.css'))
               .pipe(autoprefixer({
                   browsers: ['ie >= 8', '> 1%'],
                   cascade: false
               }))
               .pipe(gulp.dest('./static'));
});

gulp.task('default', ['css:concat']);
