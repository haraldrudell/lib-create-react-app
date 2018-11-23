/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

import { JSONer } from '../util'
import json from './libifier.json'
import libJson from './lib.json'

export default class Libifier extends JSONer {
  static libifierFile = path.join(__dirname, 'libifier.json')
  static libJsonFile = path.resolve('lib.json')
  static files = [{
    property: 'LICENSE',
    file: path.join(path.resolve(), 'LICENSE'),
  },{
    property: 'README',
    file: path.join(path.resolve(), 'README.md'),
  },{
    property: 'libindex',
    file: path.join(path.resolve(), 'src', 'libindex.js'),
  }]

  async libify() {
    const {files} = Libifier
    await Promise.all([
      this.updateJsonAndInstall(),
    ].concat(files.map(o => this.writeFileIfNotExists(o.property, o.file))))
    this.printElapsed()
  }

  async updateJsonAndInstall() {

    // add scripts entries to package.json
    const {libifierFile: filename} = Libifier
    const {pjson} = await this.updateJson(this.getScriptsObject({json, filename}))

    return Promise.all([
      this.ensureDevDependencies(pjson),
      this.ensureLibJson(pjson),
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

  async ensureLibJson(pjson) {
    const {libJsonFile} = Libifier
    if (await fs.exists(libJsonFile)) return

    // write ./lib.json
    const newLibJson = {}
    const {properties, must} = Object(libJson)
    if (typeof properties !== 'object' || typeof must !== 'object') throw new Error(`Bad lib.json: ${JSON.stringify(libJson)}`)
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
    console.log(`Writing: ${this.getRelative(libJsonFile)}`)
    return this.writeJSON(libJsonFile, newLibJson)
  }

  async writeFileIfNotExists(key, filename) {
    if (! await fs.exists(filename)) {
      console.log(`Writing: ${this.getRelative(filename)}`)
      await fs.writeFile(filename, json[key])
    }
  }
}
