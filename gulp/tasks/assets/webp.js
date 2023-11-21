// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import changed from "gulp-changed";
import gulpif from "gulp-if";
import browserSync from "browser-sync";
import webp from "gulp-webp";
import imageminWebp from "imagemin-webp";
import webp_HTML from "gulp-webp-for-html";
import webp_CSS from "gulp-webp-css";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const webpBuild = () => {
  return gulp
    .src(`${config.src.images}/**/*`)
    .pipe(changed(config.dest.images))
    .pipe(
      webp(
        gulpif(config.isProd, imageminWebp({ lossless: true, quality: 100 }))
      )
    )
    .pipe(dest(config.dest.images))
    .pipe(debug({ title: "WEBP IMAGE => " }))
    .on("end", browserSync.reload);
};
// <=================================================>
