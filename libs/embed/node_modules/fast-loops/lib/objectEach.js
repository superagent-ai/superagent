"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = objectEach;

function objectEach(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}