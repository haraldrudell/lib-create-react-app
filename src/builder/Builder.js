/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import { spawnAsync } from 'allspawn'

import path from 'path'

import { JSONer } from '../util'

export default class Builder extends JSONer {
  static projectDir = path.resolve()
  static publishDir = path.join(Builder.projectDir, 'lib')
  static rollupConfigJs = path.join(__dirname, '..', 'lib', 'rollup.config.js') // we're in the bin directory
  static rollupCmd = path.join(__dirname, '..', 'node_modules', '.bin', 'rollup')
  static symlinks = ['LICENSE', 'README.md']
    .map(file => ({
      from: path.join(Builder.projectDir, file),
      target: path.join(Builder.publishDir, file),
    })).concat({
      from: path.join(Builder.projectDir, 'lib.json'),
      target: path.join(Builder.publishDir, 'package.json'),
    })

  async build() {
    const {rollupConfigJs, symlinks} = Builder
    await Promise.all([
      this.rollup(rollupConfigJs),
    ].concat(symlinks.map(o => this.symlink(o))))
  }

  async symlink({from, target}) {
    if (await fs.exists(target)) return
    return fs.symlink(from, target)
  }

  async rollup(rollupConfigJs) {
    const {rollupCmd} = Builder
    // rollup echoes to stderr
    return spawnAsync({args: [rollupCmd, '--config', rollupConfigJs], echo: true})
  }
}
