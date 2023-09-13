"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = arrayReduce;

function arrayReduce(arr, reducer, initialValue) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr);
  }

  return initialValue;
}