/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  del = require('del');

// Styles
gulp.task('styles', function () {
    return sass('src/styles/main.scss', {
        style: 'expanded'
    })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/styles'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('public/styles'))
    .pipe(notify({
        message: 'Styles task complete'
    }));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('public/images'))
    .pipe(notify({
        message: 'Images task complete'
    }));
});

// Clean
gulp.task('clean', function () {
    return del(['public/styles', 'public/scripts', 'public/images']);
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function () {
    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['public/**']).on('change', livereload.changed);
});
