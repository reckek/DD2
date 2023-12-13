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
    cache: config.flags.isDev,
    treeshake: true,
  },
  output: {
    file: outPath,
    format: "module",
    sourcemap: config.flags.isDev ? "inline" : 'hidden',
    compact: false,
    strict: true,
  },
});

const [taskBuildMainScript, cbBuildMainScript] = createTask("buildMainScript", async () => {
  const rollupConfig = createRollupConfig(
    `${config.src.scripts}/main.js`,
    `${config.dest.scripts}/main.js`
  )

  const rollupBuilder = await rollup.rollup(rollupConfig.input)

  rollupBuilder.write(rollupConfig.output)
})

const [taskBuildPagesScripts, cbBuildScriptPages] = createTask("buildPagesScripts", () => {
  const buildScript = async (/** @type {string} */ fullPath) => {
    const buildPath = toBuildPath(fullPath)

    if (!buildPath) return

    const {lastDirName, file} = buildPath

    const rollupConfig = createRollupConfig(fullPath, `${config.dest.scripts}/${lastDirName}.${file.ext.at(-1)}`)

    const builder = await rollup.rollup(rollupConfig.input)

    builder.write(rollupConfig.output)
  }

  processFilesInPath(`${config.src.pages}/**/*.js`, buildScript, { maxNestedLevel: 1 })
})

const groupBuildScripts = groupTask([
  taskBuildMainScript,
  taskBuildPagesScripts
])

const watcherMainScript = createWatcher(`${config.src.scripts}/**/*.js`, cbBuildMainScript)
const watcherPagesScripts = createWatcher(`${config.src.pages}/**/*.js`, cbBuildScriptPages)
const watcherComponentsScripts = createWatcher(`${config.src.components}/**/*.js`, () => {
  cbBuildMainScript()
  cbBuildScriptPages()
})

const groupWatcherScripts = groupWatcher([
  watcherMainScript,
  watcherPagesScripts,
  watcherComponentsScripts
])

export {
  groupBuildScripts,
  groupWatcherScripts,
}
