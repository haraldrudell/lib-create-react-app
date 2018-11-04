/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'

import json from './prep.json'

const {scripts, files} = Object(json)
if (typeof scripts !== 'object' || Array.isArray(scripts) || !Object.values(scripts).every(v => v && typeof v === 'string')) throw new Error('prep jsopn scripts bad')

export default class Prep {
  static filename = 'package.json'

  async prep() {
    console.log('Prep.prep')
  }

  async updateJson() {
    const updates = []

    // read json
    const filename = path.resolve(Prep.filename)
    const pjson = require(filename)
    if (typeof pjson !== 'object' || Array.isArray(pjson)) throw new Error(`package.json is not object reading file: ${filename}`)

    // merge in scripts
    if (pjson.scripts === undefined) pjson.scripts = {}
    const {scripts: s0} = pjson
    for (let [script, command] of scripts) {
      if (s0[scripts] === undefined) {
        updates.push(`scripts.${script}`)
        pjson.scripts[script] = command
      }
    }

    // merge in files
    if (files && pjson.files === undefined) {
      updates.push(`files`)
      pjson.files = files
    }

    if (updates.length) {
      console.log(`writing package.json: ${updates.join('\x20')}`)
      await fs.writeFile(filename, JSON.stringify(pjson, null, '\x20\x20'))
    }
  }
}
