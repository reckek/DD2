import {parallel} from 'gulp'

/**
 * @param {(() => import('fs').FSWatcher)[]} watchers
 */
export const groupWatcher = (watchers) => {
  return parallel(...watchers)
}
