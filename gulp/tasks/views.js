// @ts-check
import gulp from "gulp";
import gulpif from "gulp-if";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import useref from "gulp-useref";
import rename from "gulp-rename"
import replace from "gulp-replace"
import config from "../config";
import {
  createTask,
  toBuildPath,
  processFilesInPath,
  createWatcher,
} from "../utils";
import * as prettier from 'gulp-plugin-prettier';

/**
 *
 * @param {{
 *  path: string
 *  outPath: string
 * }} param0
 * @returns
 */
const buildView = ({ path, outPath }) => {
  let fileName = ''

  return gulp
    .src(path)
    .pipe(plumber())
    .pipe(pug())
    .pipe(useref())
    .pipe(gulpif(config.flags.format, prettier.format()))
    .pipe(rename((path) => {
      const _fileName = outPath.split('//')[1]
      path.dirname = '../'
      path.basename = _fileName

      fileName = _fileName
    }))
    .pipe(replace(new RegExp('<link rel="stylesheet" href="index.css" />'), () => `<link rel="stylesheet" href="${config.dest.styles}/${fileName}.css" />`.replace(`${config.dest.root}/`, '')))
    .pipe(gulp.dest(outPath, { append: false }));
}

const [taskBuildViewPages, buildViewPagesCallback] = createTask(
  "buildViewPages",
  () => {
    processFilesInPath(
      `${config.src.pages}/**/*.pug`,
      (fullPath) => {
        const path = toBuildPath(fullPath);
        const fileNameIndex = path.lastIndexOf("/");

        buildView({
          path: fullPath,
          outPath: path.slice(0, fileNameIndex),
        });
      },
      { maxNestedLevel: 1 }
    );
  }
);

const watcherBuildViewPages = createWatcher(
  [`${config.src.pages}/*/*.pug`, `${config.src.components}/*/*.pug`],
  buildViewPagesCallback
);

export { taskBuildViewPages, watcherBuildViewPages };
