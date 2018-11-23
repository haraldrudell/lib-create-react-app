/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

export default class Publisher {
  static libDir = path.join(path.resolve(), 'lib')
  static publishDir = path.join(path.resolve(), 'tmpub')

  async publish() {
    const {publishDir: cwd} = Publisher

    await this.havePublish(true)

    const args = ['yarn', 'publish', '--access', 'public']
    await spawnAsync({args, echo: true, options: {cwd, stdio: 'inherit'}})
      .catch(async e => {
        await fs.havePublish(false).catch(console.error)
        throw e
      })

    return this.havePublish(false)
  }

  async havePublish(yes) {
    const {libDir, publishDir} = Publisher
    if (yes) {
    // clone lib to a directory not in .gitignore
    await fs.emptyDir(publishDir)
      return fs.copy(libDir, publishDir)
    }
    return fs.remove(publishDir)
  }
}
