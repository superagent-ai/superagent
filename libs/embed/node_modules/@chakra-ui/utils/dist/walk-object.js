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

// src/walk-object.ts
var walk_object_exports = {};
__export(walk_object_exports, {
  walkObject: () => walkObject
});
module.exports = __toCommonJS(walk_object_exports);

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

// src/object.ts
var import_lodash = __toESM(require("lodash.mergewith"));
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
var fromEntries = (entries) => entries.reduce((carry, [key, value]) => {
  carry[key] = value;
  return carry;
}, {});

// src/walk-object.ts
function walkObject(target, predicate) {
  function inner(value, path = []) {
    if (isArray(value)) {
      return value.map((item, index) => inner(item, [...path, String(index)]));
    }
    if (isObject(value)) {
      return fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          inner(child, [...path, key])
        ])
      );
    }
    return predicate(value, path);
  }
  return inner(target);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  walkObject
});
