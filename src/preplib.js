/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

this is the entry point of bin/preplib from lib-create-react-app package
*/
import Libifier from './libifier'
import Publisher from './publisher'

run({args: process.argv.slice(2)}).catch(errorHandler)

async function run({args}) {
  if (args.length === 1 && args[0] === 'publish') return new Publisher().publish()
  if (args.length) throw new Error(`preplib: no arguments allowed, received: '${args.join('\x20')}'`)
  return new Libifier().libify()
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
