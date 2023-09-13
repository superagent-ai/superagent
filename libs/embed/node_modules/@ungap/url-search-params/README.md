# URLSearchParams

[![Build Status](https://travis-ci.com/ungap/url-search-params.svg?branch=master)](https://travis-ci.com/ungap/url-search-params) [![Coverage Status](https://coveralls.io/repos/github/ungap/url-search-params/badge.svg?branch=master)](https://coveralls.io/github/ungap/url-search-params?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/ungap/url-search-params.svg)](https://greenkeeper.io/) ![WebReflection status](https://offline.report/status/webreflection.svg)


The [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) polyfill.

Previously known as [url-search-params](https://github.com/WebReflection/url-search-params).

All detections have been included and the code covered 100% (DOM patches are not measured on NodeJS though).

  * CDN global patch via https://unpkg.com/@ungap/url-search-params
  * ESM via `import URLSearchParams from '@ungap/url-search-params'`
  * CJS via `const URLSearchParams = require('@ungap/url-search-params')`

[Live test](https://ungap.github.io/url-search-params/test/)

### ⚠ Webpack Users

If you have issues just requiring `@ungap/url-search-params`, be sure you require `@ungap/url-search-params/cjs` instead.

No issue should happen if you just `import` the module instead.
