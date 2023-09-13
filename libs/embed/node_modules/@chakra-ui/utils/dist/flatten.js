"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/flatten.ts
var flatten_exports = {};
__export(flatten_exports, {
  flatten: () => flatten
});
module.exports = __toCommonJS(flatten_exports);

// src/assertion.ts
function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}
var __DEV__ = process.env.NODE_ENV !== "production";
var __TEST__ = process.env.NODE_ENV === "test";

// src/flatten.ts
function flatten(target, maxDepth = Infinity) {
  if (!isObject(target) && !Array.isArray(target) || !maxDepth) {
    return target;
  }
  return Object.entries(target).reduce((result, [key, value]) => {
    if (isObject(value) || isArray(value)) {
      Object.entries(flatten(value, maxDepth - 1)).forEach(
        ([childKey, childValue]) => {
          result[`${key}.${childKey}`] = childValue;
        }
      );
    } else {
      result[key] = value;
    }
    return result;
  }, {});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flatten
});
