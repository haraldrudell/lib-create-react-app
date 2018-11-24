/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

builds bin/preplib from src/preplib.js
*/
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import { chmod, shebang, directoryResolver } from 'rollup-plugin-thatworks'

import { readPackageJson, getExternal, formats, mergeRollups, updateJson, getLibCraDirs } from './letsroll/index.js'

updateJson() // read data files into a JSON later imported
const dirs = getLibCraDirs()
const rollupConfig = getRollupConfig()

export default [{
  input: dirs.srcPreplib,
  output: {file: dirs.binPreplib, format: formats.cjs.format},
  plugins: [shebang(), chmod()],
}].map(o => mergeRollups(rollupConfig, o))

function getRollupConfig() {
  const external = getExternal(readPackageJson({strings: {dependencies: 1}}))
  const includeExclude = {
    include: ['**/*.js', '**/*.mjs'],
    exclude: 'node_modules/**',
  }

  return {
    external,
    plugins: [
      eslint(includeExclude),
      directoryResolver({paths: 'src'}),
      resolve({jail: process.cwd()}),
      json(),
      babel({
        ...includeExclude,
        plugins: ['@babel/plugin-proposal-class-properties'],
      }),
      commonjs(),
    ],
  }
}
