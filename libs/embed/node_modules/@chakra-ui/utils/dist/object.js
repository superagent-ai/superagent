"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/object.ts
var object_exports = {};
__export(object_exports, {
  filterUndefined: () => filterUndefined,
  fromEntries: () => fromEntries,
  get: () => get,
  getCSSVar: () => getCSSVar,
  getWithDefault: () => getWithDefault,
  memoize: () => memoize,
  memoizedGet: () => memoizedGet,
  mergeWith: () => import_lodash.default,
  objectFilter: () => objectFilter,
  objectKeys: () => objectKeys,
  omit: () => omit,
  pick: () => pick,
  split: () => split
});
module.exports = __toCommonJS(object_exports);
var import_lodash = __toESM(require("lodash.mergewith"));
function omit(object, keys) {
  const result = {};
  Object.keys(object).forEach((key) => {
    if (keys.includes(key))
      return;
    result[key] = object[key];
  });
  return result;
}
function pick(object, keys) {
  const result = {};
  keys.forEach((key) => {
    if (key in object) {
      result[key] = object[key];
    }
  });
  return result;
}
function split(object, keys) {
  const picked = {};
  const omitted = {};
  Object.keys(object).forEach((key) => {
    if (keys.includes(key)) {
      picked[key] = object[key];
    } else {
      omitted[key] = object[key];
    }
  });
  return [picked, omitted];
}
function get(obj, path, fallback, index) {
  const key = typeof path === "string" ? path.split(".") : [path];
  for (index = 0; index < key.length; index += 1) {
    if (!obj)
      break;
    obj = obj[key[index]];
  }
  return obj === void 0 ? fallback : obj;
}
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new WeakMap();
  const memoizedFn = (obj, path, fallback, index) => {
    if (typeof obj === "undefined") {
      return fn(obj, path, fallback);
    }
    if (!cache.has(obj)) {
      cache.set(obj, /* @__PURE__ */ new Map());
    }
    const map = cache.get(obj);
    if (map.has(path)) {
      return map.get(path);
    }
    const value = fn(obj, path, fallback, index);
    map.set(path, value);
    return value;
  };
  return memoizedFn;
};
var memoizedGet = memoize(get);
function getWithDefault(path, scale) {
  return memoizedGet(scale, path, path);
}
function objectFilter(object, fn) {
  const result = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    const shouldPass = fn(value, key, object);
    if (shouldPass) {
      result[key] = value;
    }
  });
  return result;
}
var filterUndefined = (object) => objectFilter(object, (val) => val !== null && val !== void 0);
var objectKeys = (obj) => Object.keys(obj);
var fromEntries = (entries) => entries.reduce((carry, [key, value]) => {
  carry[key] = value;
  return carry;
}, {});
var getCSSVar = (theme, scale, value) => {
  var _a, _b, _c;
  return (_c = (_b = (_a = theme.__cssMap) == null ? void 0 : _a[`${scale}.${value}`]) == null ? void 0 : _b.varRef) != null ? _c : value;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  filterUndefined,
  fromEntries,
  get,
  getCSSVar,
  getWithDefault,
  memoize,
  memoizedGet,
  mergeWith,
  objectFilter,
  objectKeys,
  omit,
  pick,
  split
});
