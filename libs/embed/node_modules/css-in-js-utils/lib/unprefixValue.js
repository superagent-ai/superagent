"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = unprefixValue;
var RE = /(-ms-|-webkit-|-moz-|-o-)/g;

function unprefixValue(value) {
  if (typeof value === 'string') {
    return value.replace(RE, '');
  }

  return value;
}