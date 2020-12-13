/* Settings */
let base          = 'app';
let pluginsFolder = 'node_modules';

/* Modules */
const { series, parallel, src, dest, watch } = require('gulp');
const browserSync   = require('browser-sync').create();
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss      = require('gulp-clean-css');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const terser        = require('gulp-terser');
const strip         = require('gulp-strip-comments');
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const del           = require('del');
const rsync         = require('gulp-rsync');
// const devip         = require('dev-ip');

// BrowserSync
function browsersync() {
  browserSync.init({
    server: { baseDir: base },
    notify: false,
    online: true, // work in offline (if set FALSE)
    // host: devip(), // if external link doesn't work
    // tunnel: 'lets-html', // Attempt to use the URL https://lets-html.loca.lt
  });
};

// Styles
function styles() {
  return src(base+'/sass/**/*.sass')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
  }))
  .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
  .pipe(rename({ suffix: ".min" }))
  .pipe(dest(base+'/css'))
  .pipe(browserSync.stream())
}; 

// Scripts
function scripts() {
  return src([
    // 'node_modules/jquery/dist/jquery.js',
    // 'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    // 'node_modules/slick-carousel/slick/slick.js',
    base+'/js/common.js'
  ])
  .pipe(concat('app.js'))
  // .pipe(dest(base+'/js'))
  .pipe(strip())
  .pipe(terser())
  .pipe(rename({ suffix: ".min" }))
  .pipe(dest(base+'/js'))
  .pipe(browserSync.stream())
}

// Images
function images() {
	return src(base+'/img/src/**/*')
	.pipe(newer(base+'/img/dest'))
	.pipe(imagemin())
  .pipe(dest(base+'/img/dest'))
  .pipe(browserSync.stream())
}

function cleanimg() {
	return del(base+'/img/dest/**/*', { force: true })
}

// Deploy
function deploy() {
	return src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@hostname.com',
		destination: 'yousite/public_html/',
		include: ['*.htaccess'],
		exclude: ['**/Thumbs.db', '**/*.DS_Store'],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

// Watch 
function startWatch() {
  watch(base+'/sass/**/*.sass', styles);
  watch([base+'/**/*.js', '!'+base+'/js/*.min.js', '!'+base+'/js/app.js'], scripts);
  watch(base+'/img/src/**/*', images);
  watch(base+'/**/*.html').on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = series(styles, scripts, images, parallel(browsersync, startWatch))