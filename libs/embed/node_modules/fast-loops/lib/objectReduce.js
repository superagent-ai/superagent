"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectReduce;

function objectReduce(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}