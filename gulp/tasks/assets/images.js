// <=================================================>
// IMPORTS
import gulp, { dest } from "gulp";
import debug from "gulp-debug";
import changed from "gulp-changed";
import imageMin from "gulp-imagemin";
import imageMinPngquant from "imagemin-pngquant";
import webp from "gulp-webp";
import gulpif from "gulp-if";
import config from "../../config";
// <=================================================>

// <=================================================>
// BUILD FILES
export const imagesBuild = () => {
  gulp
    .src(`${config.src.images}/**/*`)
    .pipe(changed(config.dest.images))
    .pipe(
      gulpif(
        config.isProd,
        imageMin(
          [
            imageMin.mozjpeg({ quality: 70, progressive: true }),
            imageMin.optipng({ optimizationLevel: 3 }),
            imageMinPngquant({ quality: [0.8, 0.9] }),
            imageMin.svgo(),
          ],
          { verbose: true }
        )
      )
    )
    .pipe(debug({ title: "Images => " }))
    .pipe(dest(config.dest.images));

  return gulp
    .src(`${config.src.images}/**/*`)
    .pipe(changed(config.dest.images, { extension: ".webp" }))
    .pipe(webp({ quality: 70 }))
    .pipe(debug({ title: "Images => " }))
    .pipe(dest(config.dest.images));
};
// <=================================================>
