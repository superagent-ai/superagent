'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filter;

var _cssInJsUtils = require('css-in-js-utils');

var FILTER_REGEX = /filter\(/g;
// http://caniuse.com/#feat=css-filter-function
var prefixes = ['-webkit-', ''];

function filter(property, value) {
  if (typeof value === 'string' && !(0, _cssInJsUtils.isPrefixedValue)(value) && value.indexOf('filter(') !== -1) {
    return prefixes.map(function (prefix) {
      return value.replace(FILTER_REGEX, prefix + 'filter(');
    });
  }
}