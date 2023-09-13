"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPrefixedProperty;
var RE = /^(Webkit|Moz|O|ms)/;

function isPrefixedProperty(property) {
  return RE.test(property);
}