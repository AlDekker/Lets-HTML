// HTML:
/*
<svg class="svg-sprite-icon icon-nameIcon">
  <use xlink:href="img/icons/svg/symbol/sprite.svg#nameIcon"></use>
</svg>
*/

const svgSprite     = require('gulp-svg-sprite');
const svgmin        = require('gulp-svgmin');

//SVG
function svg() {
  return src(baseFolder+'/img/icons/svg/*.svg')
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {xmlMode: true}
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "sprite.svg"
      }
    }
  }))
  .pipe(dest(baseFolder+'/img/icons/svg/'))
}; 

exports.svg = svg;