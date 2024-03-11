const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const include = require('gulp-file-include');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const gulpWebpHtml = require('gulp-webp-html');

function webpImages() {
    return src('app/img/**/*')
        .pipe(webp())
        .pipe(dest('app/img/'))
        .pipe(browserSync.stream({ once: true }));
}
exports.webpImages = webpImages;

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/**/*.js',
        'app/**/*.html',
        'app/img/**/*'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function images() {
    return src('app/img/**/*')
        .pipe(imagemin({ verbose: true }))
        .pipe(dest('app/img/'))
}

function cleanDist() {
    return src("dist")
        .pipe(clean());
}

exports.build = series(images, cleanDist, building);

function runScripts() {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}
exports.runScripts = runScripts;

function runOtherScripts() {
    return src('app/js/**/*.js')
        .pipe(browserSync.stream())
}
exports.runOtherScripts = runOtherScripts;

function runStyles() {
    return src('app/scss/main.scss')
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}
exports.runStyles = runStyles;

function runFonts() {
    return src('app/scss/fonts.scss')
        .pipe(concat('fonts.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

exports.runFonts = runFonts;

function watching() {
    watch(['app/scss/**/*.scss'], runStyles);
    watch(['app/js/main.js'], runScripts);
    watch(['app/js/**/*.js'], runOtherScripts);
    watch(['app/scss/fonts.scss'], runFonts);
    watch(['app/components/*', 'app/pages/*'], includeFiles);
    watch(['app/*.html']).on('change', browserSync.reload);
}
exports.watching = watching;


function runServer() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
}
exports.runServer = runServer;


function includeFiles() {
    return src('./app/pages/*.html')
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulpWebpHtml())
        .pipe(dest('./app/'));
}
exports.includeFiles = includeFiles;

exports.default = parallel(runStyles, runScripts, runServer, includeFiles, watching);