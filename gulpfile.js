/* Settings */
let base          = 'app';
let pluginsFolder = 'node_modules';

/* Modules */
const { series, parallel, src, dest, watch } = require('gulp');
const browserSync   = require('browser-sync').create();
const devip         = require('dev-ip');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss      = require('gulp-clean-css');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const terser        = require('gulp-terser');
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const del           = require('del');
const rsync         = require('gulp-rsync');

/*Tasks*/

// BrowserSync
function browsersync() {
  browserSync.init({
    server: { baseDir: base },
    notify: false,
    online: true, // work in offline (if set FALSE)
    host: devip() 
  });
};

// Styles
function styles() {
  return src(base+'/sass/**/*.sass')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 15 versions']
  }))
  .pipe(dest(base+'/css'))
  .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
  .pipe(rename({ suffix: ".min" }))
  .pipe(dest(base+'/css'))
  .pipe(browserSync.stream())
}; 

// Scripts
function scripts() {
  return src([
    pluginsFolder+'/jquery/dist/jquery.js',
    // pluginsFolder+'/magnific-popup/dist/jquery.magnific-popup.js',
    // pluginsFolder+'/slick-carousel/slick/slick.js',
    base+'/js/common.js'
  ])
  .pipe(concat('scripts.js'))
  // .pipe(dest(base+'/js'))
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

//SVG
// const svgSprite     = require('gulp-svg-sprite'); // Установить, если нужно
// const svgmin        = require('gulp-svgmin'); // Установить, если нужно

// function svg() {
//   return src(base+'/img/src/icons/svg/*.svg')
//   .pipe(svgmin({ js2svg: { pretty: true } }))
//   .pipe(cheerio({
//     run: function ($) {
//       $('[fill]').removeAttr('fill');
//       $('[stroke]').removeAttr('stroke');
//       $('[style]').removeAttr('style');
//     },
//     parserOptions: {xmlMode: true}
//   }))
//   .pipe(replace('&gt;', '>'))
//   .pipe(svgSprite({
//     mode: {
//       symbol: { sprite: "sprite.svg" }
//     }
//   }))
//   .pipe(dest(base+'/img/dest/icons/svg/'))
// }; 

// exports.svg = svg;

/*
<svg class="svg-sprite-icon icon-nameIcon">
  <use xlink:href="img/icons/svg/symbol/sprite.svg#nameIcon"></use>
</svg>
*/

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
  watch([base+'/**/*.js', '!'+base+'/js/*.min.js', '!'+base+'/js/scripts.js'], scripts);
  watch(base+'/img/src/**/*', images);
  watch(base+'/**/*.html').on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(styles, scripts, images, browsersync, startWatch);