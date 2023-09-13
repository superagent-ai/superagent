import { isPrefixedValue } from 'css-in-js-utils';

var CALC_REGEX = /calc\(/g;
var prefixes = ['-webkit-', '-moz-', ''];

export default function calc(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('calc(') !== -1) {
    return prefixes.map(function (prefix) {
      return value.replace(CALC_REGEX, prefix + 'calc(');
    });
  }
}