# rtl-css-js

RTL conversion for CSS in JS objects

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]](#contributors-)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## The problem

For some locales, it's necessary to change `padding-left` to `padding-right`
when your text direction is right to left. There are tools like this for CSS
([`cssjanus`](https://github.com/cssjanus/cssjanus) for example) which
manipulate strings of CSS to do this, but none for CSS in JS where your CSS is
represented by an object.

## This solution

This is a function which accepts a CSS in JS object and can convert
`padding-left` to `padding-right` as well as all other properties where it makes
sense to do that (at least, that's what it's going to be when it's done... This
is a work in progress).

## Table of Contentss

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [kebab-case](#kebab-case)
  - [core](#core)
- [Caveats](#caveats)
  - [`background`](#background)
  - [CSS variables - `var()`](#css-variables---var)
- [Inspiration](#inspiration)
- [Ecosystem](#ecosystem)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save rtl-css-js
```

## Usage

This module is exposed via [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) as
well as [UMD](https://github.com/umdjs/umd) with the global as `rtlCSSJS`

CommonJS:

```javascript
const rtlCSSJS = require('rtl-css-js')
const styles = rtlCSSJS({paddingLeft: 23})
console.log(styles) // logs {paddingRight: 23}
```

You can also just include a script tag in your browser and use the `rtlCSSJS`
variable:

```html
<script src="https://unpkg.com/rtl-css-js"></script>
<script>
  const styles = rtlCSSJS({paddingRight: 23})
  console.log(styles) // logs {paddingLeft: 23}
</script>
```

You can also control which rules you don't want to flip by adding a
`/* @noflip */` CSS comment to your rule

```javascript
const rtlCSSJS = require('rtl-css-js')
const styles = rtlCSSJS({paddingLeft: '20px /* @noflip */'})
console.log(styles) // logs {paddingLeft: '20px /* @noflip */' }
```

### kebab-case

This library support kebab-case properties too.

```javascript
const rtlCSSJS = require('rtl-css-js')
const styles = rtlCSSJS({'padding-right': 23})
console.log(styles) // logs {'padding-left': 23}
```

### core

`rtl-css-js` also exposes its internal helpers and utilities so you can deal
with [certain scenarios](https://github.com/kentcdodds/rtl-css-js/pull/22)
yourself. To use these you can use the `rtlCSSJSCore` global with the UMD build,
`require('rtl-css-js/core')`, or use
`import {propertyValueConverters, arrayToObject} from 'rtl-css-js/core'`.

You can import anything that's exported from `src/core`. Please see the code
comments for documentation on how to use these.

## Caveats

### `background`

Right now `background` and `backgroundImage` just replace all instances of `ltr`
with `rtl` and `right` with `left`. This is so you can have a different image
for your LTR and RTL, and in order to flip linear gradients. Note that this is
case sensitive! Must be lower case. Note also that it _will not_ change `bright`
to `bleft`. It's a _little_ smarter than that. But this is definitely something
to consider with your URLs.

### CSS variables - `var()`

Since it's impossible to know what the contents of a css variable are until the
styles are actually calculated by the browser, any CSS variable contents will
not be converted.

## Inspiration

[CSSJanus](https://github.com/cssjanus/cssjanus) was a major inspiration.

## Ecosystem

- **[react-with-styles-interface-aphrodite](https://github.com/airbnb/react-with-styles-interface-aphrodite):**
  An interface to use
  [`react-with-styles`](https://github.com/airbnb/react-with-styles) with
  [Aphrodite](https://github.com/khan/aphrodite)
- **[fela-plugin-rtl](https://www.npmjs.com/package/fela-plugin-rtl):** A plugin
  for [fela](http://fela.js.org/) that uses rtl-css-js to convert a style object
  to its right-to-left counterpart
- **[bidi-css-js](https://github.com/TxHawks/bidi-css-js):** A library for
  authoring flow-relative css, which uses `rtl-css-js`'s core.
- **[jss-rtl](https://github.com/alitaheri/jss-rtl):** A plugin for
  [`jss`](https://github.com/cssinjs/jss) to support flipping styles
  dynamically.

## Other Solutions

I'm not aware of any, if you are please
[make a pull request](http://makeapullrequest.com) and add it here!

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=kentcdodds" title="Tests">⚠️</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://gabri.me"><img src="https://avatars.githubusercontent.com/u/63876?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Ahmed El Gabri</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=ahmedelgabri" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/majapw"><img src="https://avatars1.githubusercontent.com/u/1383861?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maja Wichrowska</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=majapw" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=majapw" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/yzimet"><img src="https://avatars2.githubusercontent.com/u/6600720?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yaniv</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=yzimet" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=yzimet" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/TxHawks"><img src="https://avatars2.githubusercontent.com/u/5658514?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Pollak</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=TxHawks" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=TxHawks" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/alitaheri"><img src="https://avatars1.githubusercontent.com/u/8528759?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ali Taheri Moghaddar</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=alitaheri" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=alitaheri" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=alitaheri" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/garrettberg"><img src="https://avatars0.githubusercontent.com/u/844459?v=4?s=100" width="100px;" alt=""/><br /><sub><b>garrettberg</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=garrettberg" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=garrettberg" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://milesj.me"><img src="https://avatars2.githubusercontent.com/u/143744?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Miles Johnson</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=milesj" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=milesj" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.kweber.com"><img src="https://avatars1.githubusercontent.com/u/2785791?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Weber</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=kevinweber" title="Code">💻</a></td>
    <td align="center"><a href="https://stackshare.io/jdorfman/decisions"><img src="https://avatars1.githubusercontent.com/u/398230?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Justin Dorfman</b></sub></a><br /><a href="#fundingFinding-jdorfman" title="Funding Finding">🔍</a></td>
    <td align="center"><a href="https://github.com/RoystonS"><img src="https://avatars0.githubusercontent.com/u/19773?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Royston Shufflebotham</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/issues?q=author%3ARoystonS" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=RoystonS" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=RoystonS" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://twitter.com/layershifter"><img src="https://avatars.githubusercontent.com/u/14183168?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Oleksandr Fediashov</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=layershifter" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ling1726"><img src="https://avatars.githubusercontent.com/u/20744592?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lingfan Gao</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=ling1726" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=ling1726" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/miroslavstastny"><img src="https://avatars.githubusercontent.com/u/9615899?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Miroslav Stastny</b></sub></a><br /><a href="https://github.com/kentcdodds/rtl-css-js/commits?author=miroslavstastny" title="Code">💻</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=miroslavstastny" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/rtl-css-js/commits?author=miroslavstastny" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/github/workflow/status/kentcdodds/rtl-css-js/validate?logo=github&style=flat-square
[build]: https://github.com/kentcdodds/rtl-css-js/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/rtl-css-js.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/rtl-css-js
[version-badge]: https://img.shields.io/npm/v/rtl-css-js.svg?style=flat-square
[package]: https://www.npmjs.com/package/rtl-css-js
[downloads-badge]: https://img.shields.io/npm/dm/mdx-bundler.svg?style=flat-square
[npmtrends]: https://www.npmtrends.com/mdx-bundler
[license-badge]: https://img.shields.io/npm/l/rtl-css-js.svg?style=flat-square
[license]: https://github.com/kentcdodds/rtl-css-js/blob/main/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/rtl-css-js/blob/main/other/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
<!-- prettier-ignore-end -->
