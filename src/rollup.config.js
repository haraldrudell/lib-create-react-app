/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// build the rollup-create-react-app package, always commonjs
import path from 'path'

import { readPackageJson, external } from './letsroll'

const {main: file} = readPackageJson({strings: {main: 'ext'}})

export default {
  input: path.join(path.resolve('src'), 'rollupCreateReactApp.js'),
  output: {file, format: 'cjs'},
  external,
}
