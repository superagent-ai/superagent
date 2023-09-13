import { isPrefixedValue } from 'css-in-js-utils';

var FILTER_REGEX = /filter\(/g;
// http://caniuse.com/#feat=css-filter-function
var prefixes = ['-webkit-', ''];

export default function filter(property, value) {
  if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('filter(') !== -1) {
    return prefixes.map(function (prefix) {
      return value.replace(FILTER_REGEX, prefix + 'filter(');
    });
  }
}