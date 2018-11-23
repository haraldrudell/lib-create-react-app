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

import path from 'path'

import { readPackageJson, getExternal, formats, mergeRollups } from './rollup/letsroll'
import chmod from './rollup/rollupChmodPlugin'
import shebang from './rollup/rollupShebangPlugin'

import { updateJson } from './rollup/updateJson'
updateJson() // read data files into a JSON later imported

// get path constants
const { dependencies } = readPackageJson({strings: {dependencies: 1}})
const external = getExternal({dependencies})
const rollupConfigJs = 'rollup.config.js'
const dirs = {
  project: path.resolve(),
}
Object.assign(dirs, {
  src: path.join(dirs.project, 'src'),
  bin: path.join(dirs.project, 'bin'),
  lib: path.join(dirs.project, 'lib'),
})
Object.assign(dirs, {
  srcPreplib: path.join(dirs.src, 'preplib.js'),
  binPreplib: path.join(dirs.bin, 'preplib'),
  srcBuilderRollup: path.join(dirs.src, 'builder', rollupConfigJs),
  libRollup: path.join(dirs.lib, rollupConfigJs),
})

const rollupConfig = getRollupConfig()

export default [{
  input: dirs.srcPreplib,
  output: {file: dirs.binPreplib, format: formats.cjs.format},
  plugins: [shebang(), chmod()],
},{
  input: dirs.srcBuilderRollup,
  output: {file: dirs.libRollup, format: formats.esm.format},
}].map(o => mergeRollups(rollupConfig, o))

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
      babel({
        ...includeExclude,
        plugins: ['@babel/plugin-proposal-class-properties'],
      }),
      commonjs(),
    ],
  }
}
