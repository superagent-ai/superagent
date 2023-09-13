"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = unprefixProperty;
var RE = /^(ms|Webkit|Moz|O)/;

function unprefixProperty(property) {
  var propertyWithoutPrefix = property.replace(RE, '');
  return propertyWithoutPrefix.charAt(0).toLowerCase() + propertyWithoutPrefix.slice(1);
}