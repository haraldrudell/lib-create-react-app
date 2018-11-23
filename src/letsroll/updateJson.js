/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'

import json from '../libifier/libifier.json'
import { filePackData, getLibCraDirs, getFilePackFilename } from './filePackData'

export function updateJson() {
  let doWrite
  const {libifierDir} = getLibCraDirs()

  for (let o of filePackData({cwd: libifierDir})) {
    const {input, jsonKey} = Object(o)
    const str = fs.readFileSync(input, 'utf8')
    if (json[jsonKey] !== str) {
      doWrite = true
      json[jsonKey] = str
    }
  }

  if (doWrite) {
    const cacheFile = getFilePackFilename(libifierDir)
    console.log(`Writing: ${cacheFile}`)
    fs.writeFileSync(cacheFile, JSON.stringify(json, null, '\x20\x20'))
  }
}
