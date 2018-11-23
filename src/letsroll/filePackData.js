/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import path from 'path'

const LICENSE = 'LICENSE'
const git = '.gitignore'
const libIndex = 'libindex.js'
const README = 'README.md'
const packageJson = 'package.json'

export function getDirs() { // in target project
  const dirs = {
    project: path.resolve(),
  }
  Object.assign(dirs, {
    src: path.join(dirs.project, 'src'),
    publish: path.join(path.resolve(), 'publish'),
  })
  Object.assign(dirs, {
    srcLibIndexJs: path.join(dirs.src, 'libindex.js'),
    publishPackageJson: path.join(dirs.publish, packageJson),
  })
  return dirs
}

export function getFilePackFilename(libifierDir) {
  return path.join(libifierDir, 'libifier.json')
}

export function filePackData({cwd = '', publish = '', src = ''}) {
  return [{
    input: path.join(cwd, LICENSE),
    jsonKey: LICENSE,
    output: path.join(publish, LICENSE),
  },{
    input: path.join(cwd, 'gitignore'),
    jsonKey: git,
    output: path.join(publish, git),
  },{
    input: path.join(cwd, libIndex),
    jsonKey: libIndex,
    output: path.join(src, libIndex),
  },{
    input: path.join(cwd, README),
    jsonKey: README,
    output: path.join(publish, README),
  }]
}

export function getLibCraDirs(binDir = '') {
  // get path constants for lib-create… project
  const rollupConfigJs = 'rollup.config.js'
  const dirs = {
    project: path.resolve(),
  }
  Object.assign(dirs, {
    src: path.join(dirs.project, 'src'),
    bin: path.join(dirs.project, 'bin'),
    lib: path.join(dirs.project, 'lib'),
    libInstalled: path.join(binDir, '..', 'lib'),
    nodeModulesInstalled: path.join(binDir, '..', 'node_modules'),
  })
  Object.assign(dirs, {
    srcPreplib: path.join(dirs.src, 'preplib.js'),
    binPreplib: path.join(dirs.bin, 'preplib'),
    srcBuilderRollup: path.join(dirs.src, 'builder', rollupConfigJs),
    libRollup: path.join(dirs.lib, rollupConfigJs),
    libifierDir: path.join(dirs.src, 'libifier'),
    rollupCmdInstalled: path.join(dirs.nodeModulesInstalled, '.bin', 'rollup'),
    rollupConfigJsInstalled: path.join(dirs.libInstalled, 'rollup.config.js'),
  })
  return dirs
}
