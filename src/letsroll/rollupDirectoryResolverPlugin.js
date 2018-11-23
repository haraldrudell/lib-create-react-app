/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'

import path from 'path'

export default class DirectoryResolver {
  constructor(options) {

    // make paths a list of absolute path names from options.path that all exist
    let {paths} = Object(options)
    if (paths === undefined) paths = []
    else if (typeof paths === 'string') paths = [paths]
    else if (!Array.isArray(paths)) throw new Error('directoryResolver: options.path not array')
    for (let [i, p] of paths.entries()) {
      if (!fs.pathExistsSync(p = path.resolve(p))) throw new Error(`directoryResolver: File or directory does not exist: '${p}'`)
      paths[i] = p
    }

    Object.assign(this, {
      paths,
      name: 'directoryResolver',
      resolveId: this.resolveId.bind(this),
      fileSuffix: ['', '.js', '.mjs', '.json'],
      dirSuffix: ['index.js', 'index.mjs', 'index.json'],
    })
  }

  async resolveId(file, origin) {
    const firstChar = (file = String(file)).substring(0, 1)
    if (firstChar === '/' || firstChar === '.') return // absolute or relative path
    return this.traversePaths(file)
  }

  async traversePaths(file) {
    for (let p of this.paths) {
      const abs = path.join(p, file)
      let f = await this.loadAsFile(abs)
      if (f) return f
      if (! await this.isDirectory(abs)) continue
      if ((f = await this.loadAsDirectory(abs))) return f
    }
  }

  async loadAsFile(abs) {
    for (let suffix of this.fileSuffix) {
      const absSuff = abs + suffix
      if (await this.isFile(absSuff)) return absSuff
    }
  }

  async loadAsDirectory(abs) {
    const pj = path.join(abs, 'package.json')
    if (await this.isFile(pj)) {
      const main = path.join(abs, String(Object(require(pj)).main || ''))
      console.log('loadAsDirectory main', main)
      let f = await this.loadAsFile(main)
      if (f) return f
      if ((f = await this.loadIndex(main))) return f
    }
    return this.loadIndex(abs)
  }

  async loadIndex(abs) {
    for (let suffix of this.dirSuffix) {
      const absSuff = path.join(abs, suffix)
      if (await this.isFile(absSuff)) return absSuff
    }
  }
  async isFile(p) {
    const stat = await this.getStat(p)
    return stat && stat.isFile()
  }
  async isDirectory(p) {
    const stat = await this.getStat(p)
    return stat && stat.isDirectory()
  }

  async getStat(p) {
    if (await fs.pathExists(p)) return fs.stat(p)
  }
}
