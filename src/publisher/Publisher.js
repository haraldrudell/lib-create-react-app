/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import { getDirs } from 'letsroll'

export default class Publisher {
  async publish() {
    const {publish: cwd, publishPackageJson} = getDirs()

    if (!await fs.exists(publishPackageJson)) throw new Error(`File does not exist: missing libprep execution? '${pjsonBuilt}'`)

    const args = ['yarn', 'publish', '--patch', '--access', 'public']
    await spawnAsync({args, echo: true, options: {cwd, stdio: 'inherit'}})
  }
}
