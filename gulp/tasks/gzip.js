import gulp, { dest } from "gulp";
import GulpZip from "gulp-zip";
import config from "../config";
import { createTask } from "../utils";

const [taskGZip] = createTask("gZip", () => {
  gulp
    .src(`${config.dest.root}/**`)
    .pipe(GulpZip("dest.zip"))
    .pipe(dest(`${config.dest.gzip}`));
});

export { taskGZip };
