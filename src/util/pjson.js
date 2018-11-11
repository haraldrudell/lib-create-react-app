/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
export function getRelative(filename) { // to pwd
  let f0 = filename
  const {pwd} = this
  filename = path.relative(pwd, filename)
  if (path.dirname(filename) === '.') filename = `.${path.sep}${filename}`
  console.log(f0, 'to', filename, `'${path.dirname(filename)}'`)
  return filename
}
