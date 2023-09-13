"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = camelCaseProperty;
var DASH = /-([a-z])/g;
var MS = /^Ms/g;
var cache = {};

function toUpper(match) {
  return match[1].toUpperCase();
}

function camelCaseProperty(property) {
  if (cache.hasOwnProperty(property)) {
    return cache[property];
  }

  var camelProp = property.replace(DASH, toUpper).replace(MS, 'ms');
  cache[property] = camelProp;
  return camelProp;
}