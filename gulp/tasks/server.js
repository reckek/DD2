// @ts-check
import browserSync from "browser-sync";
import config from "../config";
import { createTask } from "../utils";

const [taskServe] = createTask("serve", () => {
  const instance = browserSync.create();

  instance.init({
    server: {
      baseDir: config.dest.root,
    },
    files: [
      `${config.src.root}/**/*.pug`,
      `${config.src.root}/**/*.scss`,
      `${config.src.root}/**/*.js`,
      `${config.src.public}/**/*.*`,
    ],
    open: false,
    notify: true,
  });
});

export { taskServe };
