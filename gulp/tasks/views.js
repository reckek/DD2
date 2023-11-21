// @ts-check
import gulp from "gulp";
import gulpif from "gulp-if";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import htmlmin from "gulp-htmlmin";
import useref from "gulp-useref";
import config from "../config";
import {
  createTask,
  toBuildPath,
  processFilesInPath,
  createWatcher,
} from "../utils";

const buildView = ({ path, outPath }) =>
  gulp
    .src(path)
    .pipe(plumber())
    .pipe(pug())
    .pipe(useref())
    .pipe(gulpif(config.isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(outPath, { append: false }));

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
