// 'use strict'
// @ts-check
import config from "../config";

export const toBuildPath = (/** @type {string} */ path) =>
  `${config.dest.root}/${path.split("src/")[1]}`;
