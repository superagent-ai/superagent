"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectRenameKeys;

var _objectReduce = require("./objectReduce");

var _objectReduce2 = _interopRequireDefault(_objectReduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function objectRenameKeys(obj, keys) {
  return (0, _objectReduce2["default"])(obj, function (newObj, value, key) {
    newObj[keys[key] || key] = value;
    return newObj;
  }, {});
}