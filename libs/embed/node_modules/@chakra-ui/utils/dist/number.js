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

// src/number.ts
var number_exports = {};
__export(number_exports, {
  clampValue: () => clampValue,
  countDecimalPlaces: () => countDecimalPlaces,
  maxSafeInteger: () => maxSafeInteger,
  minSafeInteger: () => minSafeInteger,
  percentToValue: () => percentToValue,
  roundValueToStep: () => roundValueToStep,
  toPrecision: () => toPrecision,
  valueToPercent: () => valueToPercent
});
module.exports = __toCommonJS(number_exports);

// src/assertion.ts
function isNotNumber(value) {
  return typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value);
}
var __DEV__ = process.env.NODE_ENV !== "production";
var __TEST__ = process.env.NODE_ENV === "test";

// src/function.ts
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
var warn = /* @__PURE__ */ once((options) => () => {
  const { condition, message } = options;
  if (condition && __DEV__) {
    console.warn(message);
  }
});

// src/number.ts
var minSafeInteger = Number.MIN_SAFE_INTEGER || -9007199254740991;
var maxSafeInteger = Number.MAX_SAFE_INTEGER || 9007199254740991;
function toNumber(value) {
  const num = parseFloat(value);
  return isNotNumber(num) ? 0 : num;
}
function toPrecision(value, precision) {
  let nextValue = toNumber(value);
  const scaleFactor = 10 ** (precision != null ? precision : 10);
  nextValue = Math.round(nextValue * scaleFactor) / scaleFactor;
  return precision ? nextValue.toFixed(precision) : nextValue.toString();
}
function countDecimalPlaces(value) {
  if (!Number.isFinite(value))
    return 0;
  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
}
function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
}
function percentToValue(percent, min, max) {
  return (max - min) * percent + min;
}
function roundValueToStep(value, from, step) {
  const nextValue = Math.round((value - from) / step) * step + from;
  const precision = countDecimalPlaces(step);
  return toPrecision(nextValue, precision);
}
function clampValue(value, min, max) {
  if (value == null)
    return value;
  warn({
    condition: max < min,
    message: "clamp: max cannot be less than min"
  });
  return Math.min(Math.max(value, min), max);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clampValue,
  countDecimalPlaces,
  maxSafeInteger,
  minSafeInteger,
  percentToValue,
  roundValueToStep,
  toPrecision,
  valueToPercent
});
