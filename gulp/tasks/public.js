import gulp from "gulp";
import config from "../config";
import {createTask, createWatcher} from '../utils'

const [taskBuildPublic, buildPublicCallback] = createTask('public', () => {
  gulp
    .src(`${config.src.public}/**/*`)
    .pipe(gulp.dest(config.dest.public))
});

const watcherPublic = createWatcher(`${config.src.public}/**/*`, buildPublicCallback);

export {
  taskBuildPublic,
  watcherPublic
}
