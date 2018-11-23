/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import { spawnAsync } from 'allspawn'

import path from 'path'

const projectDir = path.resolve()
const tmpDir = path.join(projectDir, 'tmp')

it('installs on create-react-app', async () => {
  //const threeMinutes = 18e4
  const oneMinute = 6e4
  const twoMinutes = 1.2e5
  const fourMinutes = 2.4e5
  //const ThreeSeconds = 3e3
  let task, t0

  const testTime = fourMinutes
  const appName = 'lib-create-react-app-test'

  console.log(`\n>>> This test takes up to ${Math.ceil(testTime / 6e4)} minutes <<<\n` +
  `and requires an Internet connection`)
  jest.setTimeout(testTime)


  // clear and create temporary directory
  console.log(`Clearing: ${path.relative(projectDir, tmpDir)}`)
  await fs.emptyDir(tmpDir)

  // run create react app
  task = "Create React App"
  t0 = Date.now()
  await spawnAsync({args: ['npx', 'create-react-app', appName], echo: true, options: {silent: true, cwd: tmpDir, timeout: oneMinute}})
  t0 = (Date.now() - t0) / 1e3
  console.log(`${task}: ${t0.toFixed(1)} s`) // 181122: 27 s
  const appDir = path.join(tmpDir, appName)


  // install this package via file system
  task = "yarn add"
  t0 = Date.now()
  await spawnAsync({args: ['yarn', 'add', '../..'], echo: true, options: {silent: true, cwd: appDir, timeout: oneMinute}})
  t0 = (Date.now() - t0) / 1e3
  console.log(`${task}: ${t0.toFixed(1)} s`) // 181122: 31 s

  // patch project
  task = "preplib"
  t0 = Date.now()
  await spawnAsync({args: ['yarn', 'preplib'], echo: true, options: {cwd: appDir, timeout: twoMinutes}})
  t0 = (Date.now() - t0) / 1e3
  console.log(`${task}: ${t0.toFixed(1)} s`) // 181122: 69 s
})
