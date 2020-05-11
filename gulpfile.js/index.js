/* Settings */
let baseFolder    = 'app';
let pluginsFolder = 'node_modules';
let scriptName    = 'scripts';  

/* Modules */
const { series, parallel, src, dest, watch } = require('gulp');
const browserSync   = require('browser-sync');
const devip         = require('dev-ip');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const minCss        = require('gulp-clean-css');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
// const uglify        = require('gulp-uglify');
const terser        = require('gulp-terser');
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const del           = require('del');
const rsync         = require('gulp-rsync');

/*Tasks*/

// BrowserSync
function browsersync() {
  browserSync.init({
    server: { baseDir: baseFolder },
    notify: false,
    host: devip() 
  });
};

// Styles
function styles() {
  return src(baseFolder+'/sass/**/*.sass')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 15 versions']
  }))
  .pipe(dest(baseFolder+'/css'))
  .pipe(minCss())
  .pipe(rename({ suffix: ".min" }))
  .pipe(dest(baseFolder+'/css'))
  .pipe(browserSync.stream())
}; 

// Scripts
function scripts() {
  return src([
    pluginsFolder+'/jquery/dist/jquery.js',
    // pluginsFolder+'/magnific-popup/dist/jquery.magnific-popup.js',
    // pluginsFolder+'/slick-carousel/slick/slick.js',
    baseFolder+'/js/common.js'
  ])
  .pipe(concat(scriptName+'.js'))
  // .pipe(dest(baseFolder+'/js'))
  .pipe(terser())
  .pipe(rename({ suffix: ".min" }))
  .pipe(dest(baseFolder+'/js'))
  .pipe(browserSync.stream())
}

// HTML
function html() {
	return src(baseFolder+'/*.html')
	.pipe(browserSync.stream())
};

// Images
function images() {
	return src(baseFolder+'/img/src/**/*')
	.pipe(newer(baseFolder+'/img/dest'))
	.pipe(imagemin())
  .pipe(dest(baseFolder+'/img/dest'))
  .pipe(browserSync.stream())
}

function cleanimg() {
	return del(baseFolder+'/img/dest/**/*', { force: true })
}

// Deploy
function deploy() {
	return src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@hostname.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

// Watch 
function startWatch() {
  watch(baseFolder+'/sass/**/*.sass', styles);
  watch([baseFolder+'/**/*.js', '!'+baseFolder+'/js/*.min.js', '!'+baseFolder+'/js/'+scriptName+'.js'], scripts);
  watch(baseFolder+'/*.html', html);
  watch(baseFolder+'/img/**/*', images);
}

exports.browsersync = browsersync;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(html, styles, scripts, images, browsersync, startWatch);