/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'
import path from 'path'

import json from '../libifier/libifier.json'

const files = {
  LICENSE: 'LICENSE',
  libindex: 'libindex.js',
  README: 'README.md',
}
const dir = path.join(path.resolve(), 'src', 'libifier')

export function updateJson() {
  let doWrite
  for (let [key, file] of Object.entries(files)) {
    const str = fs.readFileSync(path.join(dir, file), 'utf8')
    if (json[key] !== str) {
      doWrite = true
      json[key] = str
    }
  }

  if (doWrite) {
    const file = path.join(dir, 'libifier.json')
    console.log(`Writing: ${file}`)
    fs.writeFileSync(file, JSON.stringify(json, null, '\x20\x20'))
  }
}
