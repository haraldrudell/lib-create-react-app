/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import { JSONer } from 'jsonutil'
import { filePackData, getDirs, getFilePackFilename } from 'letsroll'

import json from './libifier.json'
import libifierPackageJson from './package.json'

export default class Libifier extends JSONer {
  async libify() {
    const {publish, publishPackageJson, src} = getDirs()
    const files = filePackData({publish, src})
    await fs.ensureDir(publish)
    await Promise.all([
      this.updateJsonAndInstall(publishPackageJson),
    ].concat(files.map(o => this.writeFileIfNotExists(o.jsonKey, o.output))))
    this.printElapsed()
  }

  async updateJsonAndInstall(publishPackageJson) {

    // add scripts entries to package.json
    const filename = getFilePackFilename(__dirname)
    const {pjson} = await this.updateJson(this.getScriptsObject({json, filename}))

    return Promise.all([
      this.ensureDevDependencies(pjson),
      this.ensureLibJson(pjson, publishPackageJson),
    ])
  }

  async ensureDevDependencies(pjson) {

    // install devDependencies from json.install[] to pjson.devDependencies/dependencies
    let wantedPkgs = Object(json).install
    if (Array.isArray(wantedPkgs)) {
      const pkgs = Object.assign({}, Object(pjson).devDependencies, Object(pjson).dependencies)
      wantedPkgs = wantedPkgs
        .filter(v => v && typeof v === 'string')
        .filter(pkg => pkgs[pkg] === undefined)
    } else wantedPkgs = []

    // install required devDependencies
    if (wantedPkgs.length) {
      console.log(`Installing npm packages: ${wantedPkgs.join('\x20')}`)
      await spawnAsync({args: ['yarn', 'add', '--dev'].concat(wantedPkgs), echo: true})
    }
  }

  async ensureLibJson(pjson, publishPackageJson) {
    if (await fs.exists(publishPackageJson)) return

    // write ./lib.json
    const newLibJson = {}
    const {properties, must} = Object(libifierPackageJson)
    if (typeof properties !== 'object' || typeof must !== 'object') throw new Error(`Bad lib.json: ${JSON.stringify(libifierPackageJson)}`)
    for (let [key, value] of Object.entries(properties)) {
      let newValue
      const now = pjson[key]
      if (key === 'peerDependencies') {
        newValue = Object.assign({}, now, value) // add our peerDependencies
      } else if (key === 'dependencies') { // delete react and such dependencies
        newValue = Object.assign({}, now)
        for (let dep of Object.keys(Object(value))) delete newValue[dep]
        if (!Object.keys(newValue).length) newValue = undefined
      } else {
        newValue = now !== undefined ? now : value != null ? value : undefined
      }
      newValue !== undefined && (newLibJson[key] = newValue)
    }
    Object.assign(newLibJson, must)
    console.log(`Writing: ${this.getRelative(publishPackageJson)}`)
    return this.writeJSON(publishPackageJson, newLibJson)
  }

  async writeFileIfNotExists(key, filename) {
    if (! await fs.exists(filename)) {
      console.log(`Writing: ${this.getRelative(filename)}`)
      await fs.writeFile(filename, json[key])
    }
  }
}
