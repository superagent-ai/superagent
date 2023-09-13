"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectMap;

function objectMap(obj, mapper) {
  var mappedObj = {};

  for (var key in obj) {
    mappedObj[key] = mapper(obj[key], key, obj);
  }

  return mappedObj;
}