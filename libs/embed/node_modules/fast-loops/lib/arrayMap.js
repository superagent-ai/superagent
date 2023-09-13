"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = arrayMap;

function arrayMap(arr, mapper) {
  var mappedArr = [];

  for (var i = 0, len = arr.length; i < len; ++i) {
    mappedArr.push(mapper(arr[i], i, len, arr));
  }

  return mappedArr;
}