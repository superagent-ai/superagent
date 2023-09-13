'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crossFade;

var _cssInJsUtils = require('css-in-js-utils');

var CROSS_FADE_REGEX = /cross-fade\(/g;
// http://caniuse.com/#search=cross-fade
var prefixes = ['-webkit-', ''];

function crossFade(property, value) {
  if (typeof value === 'string' && !(0, _cssInJsUtils.isPrefixedValue)(value) && value.indexOf('cross-fade(') !== -1) {
    return prefixes.map(function (prefix) {
      return value.replace(CROSS_FADE_REGEX, prefix + 'cross-fade(');
    });
  }
}