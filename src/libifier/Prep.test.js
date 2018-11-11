/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Prep from './Prep'

import fs from 'fs-extra'

import json from './prep.json'
const {scripts} = Object(json)
const scriptsKeys = Object.keys(Object(scripts))

it('patches json', async () => {

  // prevent file write
  const spy = jest.spyOn(fs, 'writeFile')
//  spy.mockImplementation(mockWriteFile)
//  function mockWriteFile(filename, data) {}

  // read the test file
  const filename = './Prep.test.json'
  const prep = new Prep()
  Object.assign(prep, {filename}) // patch the filename read
  await prep.updateJson(filename)

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
  const {scripts} = Object(json)
  expect(typeof scripts).toBe('object')
  for (let key of scriptsKeys) if (!scripts[key]) throw new Error(`scripts key ${key} not set`)

  spy.mockReset()
  spy.mockRestore()
})
