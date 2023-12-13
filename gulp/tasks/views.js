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
      const _fileName = outPath.split('/').at(-1)?.split('.')[0]

      if (!_fileName) return

      path.basename = _fileName
      fileName = _fileName
      path.dirname = "../"
    }))
    .pipe(replace(new RegExp('<link rel="stylesheet" href="index.css" />'), () => `<link rel="stylesheet" href="${config.dest.styles}/${fileName}.css" />`.replace(`${config.dest.root}/`, '')))
    .pipe(replace(new RegExp('<link rel="stylesheet" href="index.css"/>'), () => `<link rel="stylesheet" href="${config.dest.styles}/${fileName}.css" />`.replace(`${config.dest.root}/`, '')))
    .pipe(replace(new RegExp('@scripts/index.js'), () => `${config.dest.scripts}/${fileName}.js`.replace(`${config.dest.root}/`, '')))
    .pipe(replace(new RegExp('@public/', 'g'), 'public/'))
    .pipe(gulp.dest(outPath, { append: false }));
}

const [taskBuildViewPages, buildViewPagesCallback] = createTask(
  "buildViewPages",
  () => {
    processFilesInPath(
      `${config.src.pages}/**/*.pug`,
      (fullPath) => {
        const buildPath = toBuildPath(fullPath);

        if (!buildPath) return

        const {lastDirName} = buildPath

        buildView({
          path: fullPath,
          outPath: `${config.dest.pages}/${lastDirName}.html`,
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
