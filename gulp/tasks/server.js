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
      `${config.dest.root}/**/*.*`,
    ],
    open: false,
    notify: false,
  });
});

export { taskServe };
