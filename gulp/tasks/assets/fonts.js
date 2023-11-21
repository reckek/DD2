// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const fontsBuild = () => {
  gulp
    .src(`${config.src.fonts}/**/*`)
    .pipe(ttf2woff())
    .pipe(debug({ title: "Fonts => " }))
    .pipe(dest(config.dest.fonts));  
  return gulp
    .src(`${config.src.fonts}/**/*`)
    .pipe(ttf2woff2())
    .pipe(debug({ title: "Fonts => " }))
    .pipe(dest(config.dest.fonts));
};
// <=================================================>
