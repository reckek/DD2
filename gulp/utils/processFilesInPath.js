// @ts-check

import fs from "node:fs";
import { parse } from "node:path";

/**
 * @param {string} path
 */
const scanPath = (path) => {
  const dataOfPath = parse(path);

  const isMultiSelectDirs = dataOfPath.dir.includes("**/");
  const isSelectOneNestedDir = !isMultiSelectDirs && dataOfPath.dir.includes("*/");

  const isSelectFiles =
    typeof dataOfPath.name === "string" && dataOfPath.name.includes("*");

  const isAllExt = dataOfPath.ext.includes("*");

  return {
    path,
    dataOfPath,
    isSelectOneNestedDir,
    isMultiSelectDirs,
    isSelectFiles,
    isAllExt,
  };
};

/**
 * @param {string} pathToNode
 * @param {(path: string) => void} callback
 * @param {string} [ext]
 * @param {number} [maxNestedLevel]
 * @returns
 */
const parseDir = (pathToNode, callback, ext, maxNestedLevel) => {
  let currentLevel = 0;

  /**
   * @param {string} _pathToNode
   * @returns
   */
  const _parseDir = (_pathToNode) => {
    if (fs.statSync(_pathToNode).isFile()) {
      callback(_pathToNode);
      return;
    }

    const nodes = fs.readdirSync(_pathToNode);

    nodes.forEach((node) => {
      const fullPath = _pathToNode !== pathToNode ? `${_pathToNode}/${node}` : _pathToNode + node

      if (fs.statSync(fullPath).isFile()) {
        const fileExt = fullPath.split(".")[1];

        if (ext && new RegExp(fileExt).test(ext)) {
          callback(fullPath);
        } else if (!ext) {
          callback(fullPath);
        }

        return;
      }

      if (!maxNestedLevel) {
        return _parseDir(fullPath)
      }

      if (currentLevel <= maxNestedLevel) {
        currentLevel += currentLevel;
        _parseDir(fullPath);
      }
    });
  };

  _parseDir(pathToNode);
};

/**
 * @param {string} path
 * @param {(fullPath: string) => void} callback
 * @param {{
 *  maxNestedLevel?: number
 * }} [options]
 * @returns
 */
export const processFilesInPath = (path, callback, options) => {
  const {
    isMultiSelectDirs,
    isSelectOneNestedDir,
    isSelectFiles,
    isAllExt,
    dataOfPath,
  } = scanPath(path);

  if (!isMultiSelectDirs && !isSelectOneNestedDir && !isSelectFiles && !isAllExt) {
    callback(path);
    return;
  }

  const pathIndexSelect = path.indexOf('**/')
  const relativePath = path.slice(0, pathIndexSelect)

  parseDir(
    relativePath,
    callback,
    !isAllExt ? dataOfPath.ext : undefined,
    isSelectOneNestedDir ? 1 : undefined
  );
};
