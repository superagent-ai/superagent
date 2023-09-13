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

// src/assertion.ts
var assertion_exports = {};
__export(assertion_exports, {
  __DEV__: () => __DEV__,
  __TEST__: () => __TEST__,
  isArray: () => isArray,
  isCssVar: () => isCssVar,
  isDefined: () => isDefined,
  isEmpty: () => isEmpty,
  isEmptyArray: () => isEmptyArray,
  isEmptyObject: () => isEmptyObject,
  isFunction: () => isFunction,
  isInputEvent: () => isInputEvent,
  isNotEmptyObject: () => isNotEmptyObject,
  isNotNumber: () => isNotNumber,
  isNull: () => isNull,
  isNumber: () => isNumber,
  isNumeric: () => isNumeric,
  isObject: () => isObject,
  isRefObject: () => isRefObject,
  isString: () => isString,
  isUndefined: () => isUndefined
});
module.exports = __toCommonJS(assertion_exports);
function isNumber(value) {
  return typeof value === "number";
}
function isNotNumber(value) {
  return typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value);
}
function isNumeric(value) {
  return value != null && value - parseFloat(value) + 1 >= 0;
}
function isArray(value) {
  return Array.isArray(value);
}
function isEmptyArray(value) {
  return isArray(value) && value.length === 0;
}
function isFunction(value) {
  return typeof value === "function";
}
function isDefined(value) {
  return typeof value !== "undefined" && value !== void 0;
}
function isUndefined(value) {
  return typeof value === "undefined" || value === void 0;
}
function isObject(value) {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}
function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0;
}
function isNotEmptyObject(value) {
  return value && !isEmptyObject(value);
}
function isNull(value) {
  return value == null;
}
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isCssVar(value) {
  return /^var\(--.+\)$/.test(value);
}
function isEmpty(value) {
  if (isArray(value))
    return isEmptyArray(value);
  if (isObject(value))
    return isEmptyObject(value);
  if (value == null || value === "")
    return true;
  return false;
}
var __DEV__ = process.env.NODE_ENV !== "production";
var __TEST__ = process.env.NODE_ENV === "test";
function isRefObject(val) {
  return "current" in val;
}
function isInputEvent(value) {
  return value && isObject(value) && isObject(value.target);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __DEV__,
  __TEST__,
  isArray,
  isCssVar,
  isDefined,
  isEmpty,
  isEmptyArray,
  isEmptyObject,
  isFunction,
  isInputEvent,
  isNotEmptyObject,
  isNotNumber,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isRefObject,
  isString,
  isUndefined
});
