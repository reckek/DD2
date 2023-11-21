// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const videoBuild = () => {
  return gulp
    .src(`${config.src.video}/**/*`)
    .pipe(debug("| Audio => "))
    .pipe(dest(`${config.dest.video}`));
};
// <=================================================>
