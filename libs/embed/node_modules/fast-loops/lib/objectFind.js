"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectFind;

function objectFind(obj, query) {
  for (var key in obj) {
    if (query(obj[key], key, obj)) {
      return key;
    }
  }
}