// @ts-check

import gulp from "gulp";
import config from "./gulp/config";
import { taskClear } from "./gulp/tasks/clear";
import { taskServe } from "./gulp/tasks/server";

import { groupScripts, groupWatcherScripts } from "./gulp/tasks/scripts";
import { taskBuildViewPages, watcherBuildViewPages } from "./gulp/tasks/views";
import {
  groupBuildStyles,
  groupWatchersBuildStyles,
} from "./gulp/tasks/styles";
import { taskBuildPublic, watcherPublic } from "./gulp/tasks/public";

import "./gulp/tasks/gzip";
import { taskGZip } from "./gulp/tasks/gzip";

// CHECK IF USE ARGUMENT "--prod" return true
config.setEnv();

export const build = gulp.series(
  taskClear,
  gulp.parallel([
    taskBuildViewPages,
    groupBuildStyles,
    groupScripts,
    taskBuildPublic,
  ])
);

export const zip = gulp.series(build, taskGZip);

export const watch = gulp.series(
  build,
  taskServe,
  gulp.parallel(
    groupWatcherScripts,
    groupWatchersBuildStyles,
    watcherBuildViewPages,
    watcherPublic
  )
);
