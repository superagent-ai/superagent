stack-generator
===============
[![Build Status](https://img.shields.io/github/workflow/status/stacktracejs/stack-generator/Continuous%20Integration/master?logo=github&style=flat-square)](https://github.com/stacktracejs/stack-generator/actions?query=workflow%3AContinuous+Integration+branch%3Amaster)
[![Coverage Status](https://img.shields.io/coveralls/stacktracejs/stack-generator.svg?style=flat-square)](https://coveralls.io/r/stacktracejs/stack-generator?branch=master)
[![GitHub license](https://img.shields.io/github/license/stacktracejs/stack-generator.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![dependencies](https://img.shields.io/badge/dependencies-1-green.svg?style=flat-square)](https://github.com/stacktracejs/stack-generator/releases)
[![module format](https://img.shields.io/badge/module%20format-umd-lightgrey.svg?style=flat-square&colorB=ff69b4)](https://github.com/stacktracejs/stack-generator/releases)
[![code of conduct](https://img.shields.io/badge/code%20of-conduct-lightgrey.svg?style=flat-square&colorB=ff69b4)](http://todogroup.org/opencodeofconduct/#stacktrace.js/me@eriwen.com)

Generate artificial stacktrace by walking `arguments.callee.caller` chain. **Works everywhere except [strict-mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)**.

## Usage
```
StackGenerator.backtrace()

=> [StackFrame({functionName: 'foo', args: []}), StackFrame(..), StackFrame(..)]
```

## Installation
```
npm install stack-generator
bower install stack-generator
https://raw.githubusercontent.com/stacktracejs/stack-generator/master/dist/stack-generator.min.js
```

## Browser Support
[![Sauce Test Status](https://saucelabs.com/browser-matrix/stacktracejs.svg)](https://saucelabs.com/u/stacktracejs)

## Contributing
Want to be listed as a *Contributor*? Start with the [Contributing Guide](CONTRIBUTING.md)!
