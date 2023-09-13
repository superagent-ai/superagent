"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPrefixedValue;
var RE = /-webkit-|-moz-|-ms-/;

function isPrefixedValue(value) {
  return typeof value === 'string' && RE.test(value);
}