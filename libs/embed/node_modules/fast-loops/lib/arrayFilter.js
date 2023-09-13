"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = arrayFilter;

function arrayFilter(arr, filter) {
  var filteredArr = [];

  for (var i = 0, len = arr.length; i < len; ++i) {
    var value = arr[i];

    if (filter(value, i, len, arr)) {
      filteredArr.push(value);
    }
  }

  return filteredArr;
}