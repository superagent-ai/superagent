'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixProperty;

var _capitalizeString = require('./capitalizeString');

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prefixProperty(prefixProperties, property, style) {
  var requiredPrefixes = prefixProperties[property];

  if (requiredPrefixes && style.hasOwnProperty(property)) {
    var capitalizedProperty = (0, _capitalizeString2.default)(property);

    for (var i = 0; i < requiredPrefixes.length; ++i) {
      var prefixedProperty = requiredPrefixes[i] + capitalizedProperty;

      if (!style[prefixedProperty]) {
        style[prefixedProperty] = style[property];
      }
    }
  }

  return style;
}