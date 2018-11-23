/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

import json from './libifier.json'
import { JSONer } from '../util'

export default class Libifier extends JSONer {
  static libifierFile = path.join(__dirname, 'libifier.json')

  async libify() {
    await Promise.all([
      this.updateJsonAndInstall(),
      this.write('LICENSE', path.join(path.resolve(), 'LICENSE')),
      this.write('libindex', path.join(path.resolve(), 'src', 'libindex.js')),
    ])
    this.printElapsed()
  }

  async updateJsonAndInstall() {

    // add scripts entries to package.json
    const {libifierFile: filename} = Libifier
    const {pjson} = await this.updateJson(this.getScriptsObject({json, filename}))

    // install devDependencies from json.install[] to pjson.devDependencies/dependencies
    let wantedPkgs = Object(json).install
    if (Array.isArray(wantedPkgs)) {
      const pkgs = Object.assign({}, Object(pjson).devDependencies, Object(pjson).dependencies)
      wantedPkgs = wantedPkgs
        .filter(v => v && typeof v === 'string')
        .filter(pkg => pkgs[pkg] === undefined)
    } else wantedPkgs = []

    if (wantedPkgs.length) {
      console.log(`Installing npm packages: ${wantedPkgs,join('\x20')}`)
      await spawnAsync({args: ['yarn', 'add', '--dev'].concat(wantedPkgs), echo: true})
    }
  }

  async write(key, filename) {
    if (! await fs.exists(filename)) {
      console.log(`Writing: ${filename}`)
      await fs.writeFile(filename, json[key])
    }
  }
}
