"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectMergeDeep;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function objectMergeDeep() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  for (var i = 0, len = arguments.length <= 1 ? 0 : arguments.length - 1; i < len; ++i) {
    var obj = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

    for (var key in obj) {
      var value = obj[key];

      if (_typeof(value) === 'object' && !Array.isArray(value)) {
        base[key] = objectMergeDeep(base[key], value);
        continue;
      }

      base[key] = value;
    }
  }

  return base;
}