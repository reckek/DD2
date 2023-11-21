// @ts-check

import gulp from 'gulp'

/**
 * @template {string} TaskName
 * @param {TaskName} taskName
 * @param {() => void} cb
 * @returns {[string, () => void]}
 */
export const createTask = (taskName, cb) => {
  const wrappedCb = async () => cb()
  gulp.task(taskName, wrappedCb)
  return [taskName, wrappedCb]
}

