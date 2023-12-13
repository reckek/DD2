// 'use strict'
// @ts-check
import config from "../config";

export const toBuildPath = (/** @type {string} */ path) => {
  const relativePathArray = path.split('/')

  let relativePath = `${config.dest.root}/${relativePathArray.slice(1, relativePathArray.length - 1).join('/')}`

  const lastDirName = relativePathArray.at(-2)
  const file = relativePathArray.at(-1)

  if (!file) {
    return
  }

  const [fileName, ...ext] = file.split('.')

  const _file = {
    fileName,
    ext
  }

  return {
    relativePath,
    lastDirName,
    file: _file
  }
}

export const removePages = (/** @type {string} */ path) => {
  return path.replace('pages/', '')
}
