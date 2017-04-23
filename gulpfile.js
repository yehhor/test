/// <vs />
var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

var reload = browserSync.reload;


var src = {
    scss: 'assets/sass/**/*.scss',
    css: 'assets/css',
    html: '*.html',
    js: 'assets/js/**/*.js',
    //  svg:'assets/images/**/*.svg'
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
    browserSync({
        server: "./",
        port: '4001'
    });
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
    //  gulp.watch(src.svg).on('change', reload);
    gulp.watch(src.js /*, ['babel']*/).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function () {
    return gulp.src(src.scss)
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'compressed',
        }))
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(src.css))
        .pipe(browserSync.stream());
});
gulp.task('default', ['serve']);
