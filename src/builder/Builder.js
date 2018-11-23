/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'

import { JSONer } from 'jsonutil'
import { getLibCraDirs } from 'letsroll'

export default class Builder extends JSONer {
  async build() {
    const {rollupCmdInstalled: rollup, rollupConfigJsInstalled: rollupConfigJs} = getLibCraDirs(__dirname)
    // rollup echoes to stderr
    return spawnAsync({args: [rollup, '--config', rollupConfigJs], echo: true})
  }
}
