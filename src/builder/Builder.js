/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

import { spawnAsync } from 'allspawn'

import { JSONer } from '../util'

export default class Builder extends JSONer {
  static prepJsonFile = path.join(__dirname, 'lib.config.json')

  async build() {
    const rollup = path.join(__dirname, '..', 'node_modules', '.bin', 'rollup')
    const rollupConfigJs = path.join(__dirname, '..', 'src', 'rollup', 'rollup.config.js')
    // rollup echoes to stderr
    return spawnAsync({args: [rollup, '--config', rollupConfigJs], echo: true})
    await Promise.all([
      await this.updateJson({scripts}),
      ])
    }
}
