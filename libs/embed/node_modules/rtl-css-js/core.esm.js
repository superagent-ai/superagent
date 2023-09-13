/* eslint import/no-unresolved:0 */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.warn(
    'Importing `rtl-css-js/core.esm` is deprecated, please use `rtl-css-js/core`.',
  )
}
// eslint-disable-next-line import/extensions
export * from './dist/esm/core.js'
