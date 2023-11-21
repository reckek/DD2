// @ts-check

import gulp from 'gulp'
import browserSync from 'browser-sync'

/**
 * @param {string | string[]} files
 * @param {() => void} cb
 */
export const createWatcher = (files, cb) => {
  return () => gulp.watch(files, (done) => {
    cb()
    done()
    browserSync.reload()
  })
}

