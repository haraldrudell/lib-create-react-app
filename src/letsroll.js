/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

const extensions = {
  main: '.js',
  module: '.mjs'
}

export function readPackageJson({filename, strings}) {
  // we can't use async here, so this is so 80s
  filename = filename ? String(filename) : path.resolve('package.json')
  let pjson
  try {
    pjson = require(filename)
  } catch (e) {
    console.error(`Failure reading: '${filename}'`)
    throw e
  }
  if (!strings) return pjson // you want it, you got it

  const result = {}
  for (let [prop, propArg] of Object.entries(Object(strings))) {
    let value = Object(pjson)[prop]
    if (!value || typeof value !== 'string') throw new Error(`key: ${prop}: not non-empty string in file: '${filename}'`)
    if (propArg === 'ext') value = resolveExt(value, extensions[prop])
    result[prop] = value
  }
  return result
}

export function resolveExt(file, ext) {
  file = path.resolve(String(file))
  if (ext && !path.extname(file)) file += ext
  return file
}

export const external = ['path']
