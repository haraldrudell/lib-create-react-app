/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

Rollup 0.66.6
*/

export default class debugPlugin {
  /*
  Called when rollup has finished bundling, but before generate or write is called
  you can also return a Promise
  If an error occurred during the build, it is passed on to this hook.
  */
  async buildEnd(error) {}

  /*
  Called on each rollup.rollup build.
  Return value: void or promise
  */
  async buildStart() {}

  /*
  A String, or a Function that returns a String or Promise.
  */
  async footer() {}

  /*
  Called at the end of bundle.generate() or bundle.write().
  bundle provides the full list of files being written or generated along with their details.
  => (void|Promise)
  */
  async generateBundle(outputOptions, bundle, isWrite) {}

  /*
  Type: String|Function
  A String, or a Function that returns a String or Promise.
  */
  intro() {}

  /*
  Type: Function
  Signature: (code, { modules, exports, imports, fileName, isEntry }, outputOptions) => (code | { code, map} | Promise)
  */
  async load(code, { modules, exports, imports, fileName, isEntry }, outputOptions) {}
/*
  Type: Function
  Signature: ( id ) => (code | { code, map } | Promise)

  Defines a custom loader. Returning null defers to other load functions (and eventually the default behavior of loading from the file system).

  outro(){}

  Type: String|Function

  A String, or a Function that returns a String or Promise.

  renderChunk(){}


  Can be used to transform individual chunks. Called for each Rollup output chunk file. Returning null will apply no transformations.

  renderError

  Type: Function
  Signature: ( error ) => void

  Called when rollup encounters an error during bundle.generate() or bundle.write(). The error is passed to this hook. To get notified when generation completes successfully, use the generateBundle hook.

  renderStart(){}

  Type: Function
  Signature: ( ) => (void|Promise)

  Called initially each time bundle.generate() or bundle.write() is called. To get notified when generation has completed, use the generateBundle and renderError hooks.

  resolveId

  Type: Function
  Signature: ( importee, importer ) => (id|Promise)

  Defines a custom resolver. A resolver loader can be useful for e.g. locating third-party dependencies. Returning null or undefined defers to other resolveId functions (and eventually the default resolution behavior); returning false signals that importee should be treated as an external module and not included in the bundle.

  transform

  Type: Function
  Signature: ( source, id ) => (code|{ code, map }|Promise)

  Can be used to transform individual modules.

  watchChange

  Type: Function
  Signature: (file) => { }

  Notifies a plugin
}
*/
}
