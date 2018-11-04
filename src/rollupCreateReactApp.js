/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

import { readPackageJson, external, resolveExt } from './letsroll'

const formats = [{format: 'cjs', ext: '.js'}, {format: 'esm', ext: '.mjs'}]
const {main, module} = readPackageJson()
const executables = [main, module]
  .map((v, i) => ({value: String(v || ''), ...formats[i]})) // {value, format, ext}
  .filter(o => o.value)
  .map(({value, format, ext}) => ({output: {file: resolveExt(value, ext), format}}))
if (!executables.length) throw new Error('Either main or module must be non-empty string in package.json')
const rollupConfigJs = getRollupConfig()

export default executables.length < 2
  ? {...rollupConfigJs, ...executables[0]} // single object
  : executables.map(o => ({...rollupConfigJs, ...o})) // array of objects

function getRollupConfig() {
  return {
    input: path.resolve(path.join('src', 'lib.js')),
    external,
  }
}
