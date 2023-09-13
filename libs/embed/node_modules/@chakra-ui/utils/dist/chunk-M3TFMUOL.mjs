import {
  __DEV__,
  isFunction,
  isNumber
} from "./chunk-Y5FGD7DM.mjs";

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

export {
  runIfFn,
  callAllHandlers,
  callAll,
  compose,
  once,
  noop,
  warn,
  error,
  pipe,
  distance
};
