/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import Prep from './prep'

run({args: process.argv.slice(2)}).catch(errorHandler)

async function run({args}) {
  if (args.length) throw new Error(`preplib: no arguments allowed, received: '${args.join(' ')}'`)
  return new Prep().prep()
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
