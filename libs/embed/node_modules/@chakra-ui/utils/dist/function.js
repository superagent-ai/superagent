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

// src/function.ts
var function_exports = {};
__export(function_exports, {
  callAll: () => callAll,
  callAllHandlers: () => callAllHandlers,
  compose: () => compose,
  distance: () => distance,
  error: () => error,
  noop: () => noop,
  once: () => once,
  pipe: () => pipe,
  runIfFn: () => runIfFn,
  warn: () => warn
});
module.exports = __toCommonJS(function_exports);

// src/assertion.ts
function isNumber(value) {
  return typeof value === "number";
}
function isFunction(value) {
  return typeof value === "function";
}
var __DEV__ = process.env.NODE_ENV !== "production";
var __TEST__ = process.env.NODE_ENV === "test";

// src/function.ts
function runIfFn(valueOrFn, ...args) {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}
function callAll(...fns) {
  return function mergedFn(arg) {
    fns.forEach((fn) => {
      fn == null ? void 0 : fn(arg);
    });
  };
}
var compose = (fn1, ...fns) => fns.reduce(
  (f1, f2) => (...args) => f1(f2(...args)),
  fn1
);
function once(fn) {
  let result;
  return function func(...args) {
    if (fn) {
      result = fn.apply(this, args);
      fn = null;
    }
    return result;
  };
}
var noop = () => {
};
var warn = /* @__PURE__ */ once((options) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.warn(message);
  }
});
var error = /* @__PURE__ */ once((options) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.error(message);
  }
});
var pipe = (...fns) => (v) => fns.reduce((a, b) => b(a), v);
var distance1D = (a, b) => Math.abs(a - b);
var isPoint = (point) => "x" in point && "y" in point;
function distance(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return distance1D(a, b);
  }
  if (isPoint(a) && isPoint(b)) {
    const xDelta = distance1D(a.x, b.x);
    const yDelta = distance1D(a.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  return 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  callAll,
  callAllHandlers,
  compose,
  distance,
  error,
  noop,
  once,
  pipe,
  runIfFn,
  warn
});
