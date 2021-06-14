let srcFolder  = 'app';
let distFolder = 'dist'
let base       = srcFolder;

const { series, parallel, src, dest, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const devip        = require('dev-ip');
const rsync        = require('gulp-rsync');
const sourcemaps   = require('gulp-sourcemaps');
const through      = require('through2');
const rename       = require('gulp-rename');
const del          = require('del');
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack      = require('webpack-stream');
const UglifyJs     = require('uglifyjs-webpack-plugin');
const terser       = require('gulp-terser');
const strip        = require('gulp-strip-comments');
const imagemin     = require('gulp-imagemin');

/* BrowserSync */
function browsersync() {
  browserSync.init({
    notify: false,
    online: true,
    server: { baseDir: base },
    // proxy: base,
    // tunnel: 'lets-html', // URL: https://lets-html.loca.lt
    // host: devip(), // if external link doesn't work
  });
};

/* SASS */
function styles() {
  return src(`${base}/sass/*.sass`)
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer({ cascade: false }))
  .pipe(cleancss({
    level: { 1: { specialComments: 0 } },
  }, 
  details => {
    console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
  }))
  .pipe(rename({ suffix: ".min" }))
  .pipe(sourcemaps.write())
  .pipe(dest(`${base}/css`))
  .pipe(browserSync.stream())
};

/* Javascript */
function scripts() {
  return src(`${base}/js/main.js`)
  .pipe(webpack({
    mode: 'production',
    performance: { hints: false },
    optimization: { 
      minimize: true, 
      minimizer: [
        new UglifyJs({
          uglifyOptions: {
            output: {
              comments: false
            }
          },
          sourceMap: true
        })
      ] 
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env'],
            plugins: ['babel-plugin-root-import']
          }
        }
      ]
    }
  })).on('error', function handleError() {
    this.emit('end')
  })
  // .pipe(terser()) // if not need babel
  // .pipe(strip())
  .pipe(rename({ 
    basename: "app",
    suffix: ".min" 
  }))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(through.obj(function (file, enc, cb) {
    const isSourceMap = /\.map$/.test(file.path);
    if (!isSourceMap) this.push(file);
    cb();
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest(`${base}/js`))
  .pipe(browserSync.stream())
}

/* Images */
function images() {
  return src([
    `${distFolder}/img/**/*`,
    `!${distFolder}/img/**/favicons/**/*`,
  ])
  .pipe(imagemin())
  .pipe(dest(distFolder+'/img'))
}

/* Build */
function buildTransfer() {
  return src([
    srcFolder + '/css/*.min.*',
    srcFolder + '/js/*.min.*',
    srcFolder + '/fonts/**/*',
    srcFolder + '/img/**/*',
    srcFolder + '/**/{*.html, *.php}',
    srcFolder + '/*.txt',
    srcFolder + '/.htaccess',
    srcFolder + '/mail/**/*',
  ], { base: srcFolder+'/' })
  .pipe(dest(distFolder))
}

function buildClear() {
  return del(distFolder, { force: true })
}

/* Deploy */
function deploy() {
  return src(distFolder)
  .pipe(rsync({
    root: distFolder,
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

/* Watch */
function startWatch() {
  watch(base+'/sass/**/*.sass').on('change', styles);
  watch([base+'/js/*.js', '!'+base+'/js/*.min*'], scripts);
  watch(base+'/**/*.{html,htm,php,twig,tpl}').on('change', browserSync.reload);
}


exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.deploy      = deploy;
exports.browsersync = browsersync;
exports.buildClear  = buildClear;
exports.build       = series(styles, scripts, buildClear, buildTransfer, images);
exports.default     = series(styles, scripts, parallel(browsersync, startWatch))