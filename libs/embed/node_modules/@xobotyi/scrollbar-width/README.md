<div align="center">
    <H1>@xobotyi/scrollbar-width</H1>
    <p>A tool to get browser's scrollbars width.</p>
    <p>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/travis/xobotyi/scrollbar-width" alt="Build status"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/npm/v/@xobotyi/scrollbar-width" alt="NPM version"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/npm/dw/@xobotyi/scrollbar-width" alt="NPM weekly downloads"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/npm/license/@xobotyi/scrollbar-width" alt="License"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/npm/types/@xobotyi/scrollbar-width" alt="Types definition"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/codacy/grade/1bc2560a1b614f9595b718169c969b4d" alt="Codacy Code Grade"/>
        </a>
        <a href="https://www.npmjs.com/package/@xobotyi/scrollbar-width">
            <img src="https://flat.badgen.net/codacy/coverage/1bc2560a1b614f9595b718169c969b4d" alt="Tests LOC"/>
        </a>
    </p>
    <p>×&nbsp;<strong><a href="https://codesandbox.io/s/xobotyiscrollbar-width-live-demo-bp5no">LIVE EXAMPLE</a></strong>&nbsp;×</p>
</div>

---

<div align="center">❤️Please consider starring this project to show your love and support.🙌</div>

---

## Installation

```bash
npm install @xobotyi/scrollbar-width
# or via yarn
yarn add @xobotyi/scrollbar-width
```
_INSTALLATION NOTE:_  
This lib is written in TypeScript and delivered with both, transpiled and untranspiled ES versions:

- `main` field of package.json is pointing to transpiled ES5-compatible version with CJS modules resolution;
- `module` field is pointing to transpiled ES5-compatible version with ES modules resolution;
- `esnext` field is pointing to the ESnext version with ES modules resolution;


**OR**  
you can add it directly to your site via the `<script />` with help of [UNPKG](https://unpkg.com):
```html
<script src="https://unpkg.com/@xobotyi/scrollbar-width/dist/index.min.js"/>
```
After that you will be able to use the function as `xobotyi.scrollbarWidth()`

## Usage

```javascript
import { scrollbarWidth } from '@xobotyi/scrollbar-width';

scrollbarWidth(); // for most browsers will return 17 and 0 for SSR environment
// or undefined if to call it too early [read below]
```

This function caches the value to avoid increased resources usage. In case you want to get re-calculated value - pass `true` as first call parameter.

>**NOTE:**  
>Function will return `undefined` in case being called before the DOM is ready.

#### One more clarification
This function has inner cache due to scrollbars width is not intended to be changed since initial call, but it can in case you toggle the device emulation.  
If you need function to recalculate the width call it with `true` parameter and get new value or set `scrollbarWidth.__cache` to `undefined` and next call will return the fresh value.

## Related projects

- [react-scrollbars-custom](https://www.npmjs.com/package/react-scrollbars-custom) &mdash; The best React custom scrollbars component. Allows you to customise scrollbars as you like it, crossbrowser!
- [zoom-level](https://www.npmjs.com/package/zoom-level) &mdash; A comprehensive cross-browser package that allow you to determine page's and element's zoom level.
- [@xobotyi/should-reverse-rtl-scroll](https://www.npmjs.com/package/@xobotyi/should-reverse-rtl-scroll) &mdash; A tool detecting if RTL scroll value should be negative.
