/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'

import path from 'path'

import { readPackageJson, getExternal, formats, mergeRollups } from '../rollup/letsroll'

// get path constants
const strings = {main: 'ext', module: 'ext', dependencies: 1}
const filename = path.resolve('lib.json')
const {main, module, dependencies} = readPackageJson({filename, strings})
const external = getExternal({dependencies})
const dirs = {
  project: path.resolve(),
}
Object.assign(dirs, {
  src: path.join(dirs.project, 'src'),
})
Object.assign(dirs, {
  srcLibIndexJs: path.join(dirs.src, 'libindex.js'),
})

const rollupConfigJs = getRollupConfig()

export default [{
  input: dirs.srcLibIndexJs,
  output: {file: main, format: formats.cjs.format},
},{
  input: dirs.srcLibIndexJs,
  output: {file: module, format: formats.esm.format},
}].map(o => mergeRollups(rollupConfigJs, o))

function getRollupConfig() {
  const includeExclude = {
    include: ['**/*.js', '**/*.mjs'],
    exclude: 'node_modules/**',
  }

  return {
    external,
    plugins: [
      eslint(includeExclude),
      resolve({extensions: ['.mjs', '.js', '.json']}),
      json(),
      babel(Object.assign({},
        includeExclude,
        {plugins: ['@babel/plugin-proposal-class-properties']},
      )),
      commonjs(),
    ],
  }
}
