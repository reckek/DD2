// @ts-check

import rollup from "rollup";
import config from "../config";
import {
  createTask,
  toBuildPath,
  processFilesInPath,
  createWatcher,
  groupTask,
  groupWatcher,
} from "../utils";

/**
 * @param {string} path
 * @param {string} outPath
 * @returns {{
 *  input: rollup.RollupOptions
 *  output: rollup.OutputOptions
 * }}
 */
const createRollupConfig = (path, outPath) => ({
  input: {
    input: path,
    cache: true,
    treeshake: true,
  },
  output: {
    file: outPath,
    format: "module",
    sourcemap: true,
  },
});

const [taskScripts, scriptsCallback] = createTask("scripts", () => {
  const rollupConfig = createRollupConfig(
    `${config.src.scripts}/main.js`,
    config.dest.scripts
  );

  rollup
    .rollup(rollupConfig.input)
    .then((builder) => builder.write(rollupConfig.output));
});

const [taskPagesScripts, pagesScriptsCallback] = createTask(
  "pagesScripts",
  () => {
    processFilesInPath(
      `${config.src.pages}/**/*.js`,
      (fullPath) => {
        const path = toBuildPath(fullPath);
        const fileNameIndex = path.lastIndexOf("/");

        const rollupConfig = createRollupConfig(
          fullPath,
          path.slice(0, fileNameIndex)
        );

        rollup
          .rollup(rollupConfig.input)
          .then((builder) => builder.write(rollupConfig.output));
      },
      { maxNestedLevel: 1 }
    );
  }
);

const [taskComponentsScripts, componentsScriptsCallback] = createTask(
  "pagesScripts",
  () => {
    scriptsCallback();
    pagesScriptsCallback();
  }
);

const watcherScripts = createWatcher(
  `${config.src.scripts}/main.js`,
  scriptsCallback
);
const watcherPagesScripts = createWatcher(
  `${config.src.pages}/*/*.js`,
  pagesScriptsCallback
);
const watcherComponentsScripts = createWatcher(
  `${config.src.components}/*/*.js`,
  componentsScriptsCallback
);

export const groupScripts = groupTask([
  taskScripts,
  taskPagesScripts,
  taskComponentsScripts,
]);

export const groupWatcherScripts = groupWatcher([
  watcherScripts,
  watcherPagesScripts,
  watcherComponentsScripts,
]);
