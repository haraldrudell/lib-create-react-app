/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

import nodeExternals from './nodeExternals'

const extensions = {
  main: '.js',
  module: '.mjs',
}

export function readPackageJson({filename, strings, baseDir = ''}) {

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
    if (propArg !== 1) {
      if (!value || typeof value !== 'string') throw new Error(`key: ${prop}: not non-empty string in file: '${filename}'`)
      if (propArg === 'ext') value = resolveExt(value, extensions[prop], baseDir)
    }
    result[prop] = value
  }
  return result
}

export function resolveExt(file, ext, baseDir) {
  file = path.resolve(baseDir, String(file))
  if (ext && !path.extname(file)) file += ext
  return file
}

// keys: 0, cjs and 1, mjs, value: {format, ext}
export const formats = [{format: 'cjs', ext: '.js', id: 0}, {format: 'esm', ext: '.mjs', id: 1}]
  .reduce((acc, {format, ext, id}) => {
    acc[id] = acc[format] = {format, ext}
    return acc
  }, {})

export function mergeRollups(...args) {
  const result = {}
  for (let arg of args) {
    const {plugins} = Object(arg)
    const props = Object.assign({}, arg)
    delete props.plugins
    Object.assign(result, props)
    if (plugins !== undefined) {
      if (!Array.isArray(plugins)) throw new Error('plugins property not array')
      const {plugins: p0} = result
      result.plugins = !Array.isArray(p0)
        ? plugins
        : [].concat(p0, plugins)
    }
  }
  return result
}

export function getExternal({external, dependencies, peerDependencies}) {
  return (Array.isArray(external) ? external : nodeExternals).concat(
    Object.keys(Object(dependencies)),
    Object.keys(Object(peerDependencies))
    )
}
