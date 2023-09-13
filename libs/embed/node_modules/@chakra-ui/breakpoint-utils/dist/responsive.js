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

// src/responsive.ts
var responsive_exports = {};
__export(responsive_exports, {
  arrayToObjectNotation: () => arrayToObjectNotation,
  breakpoints: () => breakpoints,
  isCustomBreakpoint: () => isCustomBreakpoint,
  isResponsiveObjectLike: () => isResponsiveObjectLike,
  mapResponsive: () => mapResponsive,
  objectToArrayNotation: () => objectToArrayNotation
});
module.exports = __toCommonJS(responsive_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var breakpoints = Object.freeze([
  "base",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
]);
function mapResponsive(prop, mapper) {
  if (Array.isArray(prop)) {
    return prop.map((item) => item === null ? null : mapper(item));
  }
  if ((0, import_shared_utils.isObject)(prop)) {
    return Object.keys(prop).reduce((result, key) => {
      result[key] = mapper(prop[key]);
      return result;
    }, {});
  }
  if (prop != null) {
    return mapper(prop);
  }
  return null;
}
function objectToArrayNotation(obj, bps = breakpoints) {
  const result = bps.map((br) => {
    var _a;
    return (_a = obj[br]) != null ? _a : null;
  });
  const lastItem = result[result.length - 1];
  while (lastItem === null)
    result.pop();
  return result;
}
function arrayToObjectNotation(values, bps = breakpoints) {
  const result = {};
  values.forEach((value, index) => {
    const key = bps[index];
    if (value == null)
      return;
    result[key] = value;
  });
  return result;
}
function isResponsiveObjectLike(obj, bps = breakpoints) {
  const keys = Object.keys(obj);
  return keys.length > 0 && keys.every((key) => bps.includes(key));
}
var isCustomBreakpoint = (v) => Number.isNaN(Number(v));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrayToObjectNotation,
  breakpoints,
  isCustomBreakpoint,
  isResponsiveObjectLike,
  mapResponsive,
  objectToArrayNotation
});
