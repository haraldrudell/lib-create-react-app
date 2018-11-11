/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs-extra'
import { spawnAsync } from 'allspawn'

import path from 'path'

const projectDir = path.resolve()
const tmpDir = path.resolve('tmp')

it('installs on create-react-app', async () => {
  const threeMinutes = 18e4
  const oneMinute = 6e4
  const ThreeSeconds = 3e3
  const appName = 'tmp-app'
  jest.setTimeout(threeMinutes)

  // clear and create temporary directory
  console.log(`Clearing: ${path.relative(projectDir, tmpDir)}`)
  await fs.emptyDir(tmpDir)

  // install create react app
  await spawnAsync({args: ['npx', 'create-react-app', appName], echo: true, options: {silent: true, cwd: tmpDir, timeout: oneMinute}})
  const appDir = path.join(tmpDir, appName)

  // install this package via file system
  await spawnAsync({args: ['yarn', 'add', '../..'], echo: true, options: {silent: true, cwd: appDir, timeout: oneMinute}})

  // patch project
  await spawnAsync({args: ['yarn', 'preplib'], echo: true, options: {cwd: appDir, timeout: ThreeSeconds}})
})
