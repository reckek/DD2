// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const audioBuild = () => {
  return gulp
    .src(`${config.src.audio}/**/*`)
    .pipe(debug("| Video => "))
    .pipe(dest(`${config.dest.audio}`));
};
// <=================================================>
