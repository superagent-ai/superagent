'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calc;

var _cssInJsUtils = require('css-in-js-utils');

var CALC_REGEX = /calc\(/g;
var prefixes = ['-webkit-', '-moz-', ''];

function calc(property, value) {
  if (typeof value === 'string' && !(0, _cssInJsUtils.isPrefixedValue)(value) && value.indexOf('calc(') !== -1) {
    return prefixes.map(function (prefix) {
      return value.replace(CALC_REGEX, prefix + 'calc(');
    });
  }
}