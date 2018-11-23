import path from 'path';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
var nodeExternals = ['assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http2', 'http', 'https', 'inspector', 'internal', 'module', 'net', 'os', 'path', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
const extensions = {
  main: '.js',
  module: '.mjs'
};
function readPackageJson({
  filename,
  strings
}) {
  // we can't use async here, so this is so 80s
  filename = filename ? String(filename) : path.resolve('package.json');
  let pjson;

  try {
    pjson = require(filename);
  } catch (e) {
    console.error(`Failure reading: '${filename}'`);
    throw e;
  }

  if (!strings) return pjson; // you want it, you got it

  const result = {};

  for (let [prop, propArg] of Object.entries(Object(strings))) {
    let value = Object(pjson)[prop];

    if (propArg !== 1) {
      if (!value || typeof value !== 'string') throw new Error(`key: ${prop}: not non-empty string in file: '${filename}'`);
      if (propArg === 'ext') value = resolveExt(value, extensions[prop]);
    }

    result[prop] = value;
  }

  return result;
}
function resolveExt(file, ext) {
  file = path.resolve(String(file));
  if (ext && !path.extname(file)) file += ext;
  return file;
} // keys: 0, cjs and 1, mjs, value: {format, ext}

const formats = [{
  format: 'cjs',
  ext: '.js',
  id: 0
}, {
  format: 'esm',
  ext: '.mjs',
  id: 1
}].reduce((acc, {
  format,
  ext,
  id
}) => {
  acc[id] = acc[format] = {
    format,
    ext
  };
  return acc;
}, {});
function mergeRollups(...args) {
  const result = {};

  for (let arg of args) {
    const {
      plugins
    } = Object(arg);
    const props = Object.assign({}, arg);
    delete props.plugins;
    Object.assign(result, props);

    if (plugins !== undefined) {
      if (!Array.isArray(plugins)) throw new Error('plugins property not array');
      const {
        plugins: p0
      } = result;
      result.plugins = !Array.isArray(p0) ? plugins : [].concat(p0, plugins);
    }
  }

  return result;
}
function getExternal({
  external,
  dependencies
}) {
  if (!Array.isArray(external)) external = nodeExternals;
  return [].concat(external, Object.keys(Object(dependencies)));
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/

const strings = {
  main: 'ext',
  module: 'ext',
  dependencies: 1
};
const filename = path.resolve('lib.json');
const {
  main,
  module: module$1,
  dependencies
} = readPackageJson({
  filename,
  strings
});
const external = getExternal({
  dependencies
});
const dirs = {
  project: path.resolve()
};
Object.assign(dirs, {
  src: path.join(dirs.project, 'src')
});
Object.assign(dirs, {
  srcLibIndexJs: path.join(dirs.src, 'libindex.js')
});
const rollupConfigJs = getRollupConfig();
var rollup_config = [{
  input: dirs.srcLibIndexJs,
  output: {
    file: main,
    format: formats.cjs.format
  }
}, {
  input: dirs.srcLibIndexJs,
  output: {
    file: module$1,
    format: formats.esm.format
  }
}].map(o => mergeRollups(rollupConfigJs, o));

function getRollupConfig() {
  const includeExclude = {
    include: ['**/*.js', '**/*.mjs'],
    exclude: 'node_modules/**'
  };
  return {
    external,
    plugins: [eslint(includeExclude), resolve({
      extensions: ['.mjs', '.js', '.json']
    }), json(), babel(Object.assign({}, includeExclude, {
      plugins: ['@babel/plugin-proposal-class-properties']
    })), commonjs()]
  };
}

export default rollup_config;
