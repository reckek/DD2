// @ts-check

import gulp from "gulp";

import gulpSass from "gulp-sass";
import dartSass from "sass";

import mincss from "gulp-clean-css";
import gulpif from "gulp-if";
import plumber from "gulp-plumber";
import sourcemaps from "gulp-sourcemaps";
import config from "../config";
import {
  groupTask,
  createTask,
  createWatcher,
  processFilesInPath,
  toBuildPath,
  groupWatcher,
  removePages,
} from "../utils";
import rename from "gulp-rename";
import replace from "gulp-replace";
import * as prettier from 'gulp-plugin-prettier';
import gulpIf from "gulp-if";

const sass = gulpSass(dartSass);

const buildStyle = ({ path, outPath }) => {
  return gulp
    .src(path)
    .pipe(plumber())
    .pipe(gulpif(config.flags.isDev, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(config.flags.isDev, sourcemaps.write()))
    .pipe(
      gulpif(
        config.flags.isProd,
        mincss({
          compatibility: "ie9",

          level: {
            1: {
              removeEmpty: true,
              removeWhitespace: true,
            },
            2: {
              mergeMedia: true,
              removeEmpty: true,
              removeDuplicateFontRules: true,
              removeDuplicateMediaBlocks: true,
              removeDuplicateRules: true,
              removeUnusedAtRules: false,
            },
          },
        })
      )
    )
    .pipe(gulpIf(config.flags.format, prettier.format()))
    .pipe(rename(path => {
        path.dirname = "../styles";
    }))
    .pipe(replace(new RegExp('@public/', 'g'), () => '../public/'))
    .pipe(gulp.dest(outPath));
};

/**
 *
 * @param {{
 *  path: string
 *  outPath: string
 * }} param0
 * @returns
 */
const buildPageStyle = ({ path, outPath }) => {
  return gulp
    .src(path)
    .pipe(plumber())
    .pipe(gulpif(config.isDev, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(config.isDev, sourcemaps.write()))
    .pipe(
      gulpif(
        config.flags.isProd,
        mincss({
          compatibility: "ie9",

          level: {
            1: {
              removeEmpty: true,
              removeWhitespace: true,
            },
            2: {
              mergeMedia: true,
              removeEmpty: true,
              removeDuplicateFontRules: true,
              removeDuplicateMediaBlocks: true,
              removeDuplicateRules: true,
              removeUnusedAtRules: false,
            },
          },
        })
      )
    )
    .pipe(gulpIf(config.flags.format, prettier.format()))
    .pipe(rename(path => {
      const fileName = outPath.split('/').at(-1)?.split('.')[0]

      if (!fileName) return

      path.basename = fileName
      path.dirname = "../"
    }))
    .pipe(replace(new RegExp('@public/', 'g'), () => '../public/'))
    .pipe(gulp.dest(outPath));
};

const [taskBuildStyles, buildStylesCallback] = createTask("buildStyles", () =>
  buildStyle({
    path: `${config.src.styles}/main.scss`,
    outPath: `${config.dest.styles}`,
  })
);

const [taskBuildPagesStyles, buildPagesStylesCallback] = createTask(
  "buildPagesStyles",
  () =>
    processFilesInPath(
      `${config.src.pages}/**/*.scss`,
      (fullPath) => {
        const buildPath = toBuildPath(fullPath);

        if (!buildPath) return

        const {lastDirName} = buildPath

        buildPageStyle({
          path: fullPath,
          outPath: `${config.dest.styles}/${lastDirName}.css`,
        });
      },
      { maxNestedLevel: 1 }
    )
);

const [taskBuildComponents, buildComponentsCallback] = createTask(
  "buildComponentsStyles",
  () => {
    buildStylesCallback();
    buildPagesStylesCallback();
  }
);

const watcherBuildStyle = createWatcher(
  `${config.src.styles}/**/*.scss`,
  buildStylesCallback
);
const watcherPagesStyles = createWatcher(
  `${config.src.pages}/*/*.scss`,
  buildPagesStylesCallback
);
const watcherPagesComponents = createWatcher(
  `${config.src.components}/**/*.scss`,
  buildComponentsCallback
);

export const groupBuildStyles = groupTask([
  taskBuildStyles,
  taskBuildPagesStyles,
  taskBuildComponents,
]);

export const groupWatchersBuildStyles = groupWatcher([
  watcherBuildStyle,
  watcherPagesStyles,
  watcherPagesComponents,
]);
