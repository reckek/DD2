// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import svgSprites from "gulp-svg-sprite";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const svgBuild = () => {
  return gulp
    .src(`${config.src.icons}/**/*`)
    .pipe(
      svgSprites({
        mode: {
          symbol: {
            sprite: "../stack/icons.stack.svg",
            example: config.isDev,
          },
        },
      })
    )
    .pipe(debug("| SVG => "))
    .pipe(dest(`${config.dest.icons}`));
};
// <=================================================>
