/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'

import path from 'path'

import prepJson from './prep.json'

export default class Libifier {
  static filename = path.resolve('package.json')
  static prepJsonFile = path.join(__dirname, 'prep.json')
  static prepJsonFile = path.join(__dirname, 'lib.config.json')
  pwd = path.resolve()

  constructor() {
    const {prepJsonFile} = Libifier
    const {scripts: newScripts} = this.getScriptsObject({json: prepJson, filename: prepJsonFile})
    Object.assign(this, {newFiles: prepJson.files, newScripts})
  }

  async libify() {
    const t0 = Date.now()
    await Promise.all([
      this.updateJson(),
    ])
    const seconds = (Date.now() - t0) / 1e3
    console.log(`Completed in ${seconds.toFixed(1)} s`)
  }

  async updateJson(filename) {
    const {newScripts, newFiles} = this
    const updates = []

    // read the React project's package.json
    if (!filename) {
      filename = Libifier.filename
      console.log(`reading: ${this.getRelative(filename)}`)
    }
    const pjson = require(filename)
    const {scripts, isChange} = this.getScriptsObject({json: pjson, filename})
    if (isChange) updates.push('scripts') // json.scripts was updated

    // merge in newScripts
    for (let [script, command] of Object.entries(newScripts)) {
      if (scripts[script] === undefined) {
        updates.push(`scripts.${script}`)
        scripts[script] = command
      }
    }

    // merge in files
    if (newFiles && pjson.files === undefined) {
      updates.push(`files`)
      pjson.files = newFiles
    }

    if (updates.length) {
      console.log(`writing package.json: ${updates.join('\x20')}`)
      await fs.writeFile(filename, JSON.stringify(pjson, null, '\x20\x20'))
    }
  }

  isObject(o) {
    return typeof o === 'object' && !Array.isArray(o)
  }

  getScriptsObject({json, filename}) {
    let isChange = false
    if (!this.isObject(json)) throw new Error(`package.json content not object reading file: ${filename}`)
    let {scripts} = json
    if (!this.isObject(scripts)) {
      isChange = true
      scripts = json.scripts = {}
    } else if (!Object.values(scripts).every(v => v && typeof v === 'string')) throw new Error(`scripts values not string in file: ${filename}`)
    return {scripts, isChange}
  }

}
