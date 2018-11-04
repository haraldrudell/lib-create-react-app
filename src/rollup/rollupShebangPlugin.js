/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export default function shebangPlugin(shebang) {
  return {
    name: 'shebang Rollup plugin',
    transformBundle(code) {
      return String(shebang || '#!/usr/bin/env node\n') + code
    },
  }
}
