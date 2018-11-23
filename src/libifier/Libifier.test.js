/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Libifier from './Libifier'

import fs from 'fs-extra'

import path from 'path'

import LibifierJson from './Libifier.json'
import LibifierTestJson from './Libifier.test.json'

it('patches json', async () => {

  /*
  take the scripts property from ./Libifier.json
  and insert it into the empty ./Libifier.test.json
  but do not write out the result to ./Libifier.test.json
  */
  const {scripts} = Object(LibifierJson)
  const scriptsKeys = Object.keys(Object(scripts))

  // verify that Libifier.test.json is empty
  const filename = path.join(__dirname, 'Libifier.test.json')
  if (typeof LibifierTestJson !== 'object' || Object.keys(LibifierTestJson).length)
    throw new Error(`File has bad content: ${filename}`)

  // prevent file write
  const spy = jest.spyOn(fs, 'writeFile')
  spy.mockImplementation(mockWriteFile)
  function mockWriteFile(filename, data) {}

  // read the test file
  const prep = new Libifier()
  await prep.updateJson({filename, scripts})

  // verify 1 invocation
  const actual = fs.writeFile.mock.calls
  expect(Array.isArray(actual)).toBeTruthy()
  expect(actual.length).toBe(1)

  // verify 2 arguments: filename, data
  expect(Array.isArray(actual[0])).toBeTruthy()
  expect(actual[0].length).toBe(2)
  const [actualFilename, actualData] = actual[0]
  expect(actualFilename).toBe(filename)
  expect(typeof actualData).toBe('string')
  const json = JSON.parse(actualData)
  const {scripts: actualScripts} = Object(json)
  expect(typeof actualScripts).toBe('object')
  for (let key of scriptsKeys) if (!actualScripts[key]) throw new Error(`scripts key ${key} not set`)

  spy.mockReset()
  spy.mockRestore()
})
