/* eslint-disable */

const glob = require('glob')
const fs = require('fs-extra')

const removeExtraFiles = () => new Promise((resolve, reject) => {
  glob('./dist/**/*+(*.test.*|__snapshots__)', (error, files) => {
    if (error) {
      throw error
    }

    Promise
      .all(files.map((file) => fs.remove(file)))
      .then(resolve, reject)
      .catch((removeError) => {
        throw removeError
      })
  })
})

console.log('Starting post-build script')

Promise.all([
  removeExtraFiles(),
  fs.copy('./package.json', './dist/package.json'),
  fs.copy('./LICENSE', './dist/LICENSE'),
  fs.copy('./README.md', './dist/README.md')
])
  .catch((error) => {
    throw error
  })
