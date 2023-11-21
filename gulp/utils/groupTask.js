import {parallel} from 'gulp'

/**
 * @param {string[]} tasks
 */
export const groupTask = (tasks) => {
  return parallel(...tasks)
}
