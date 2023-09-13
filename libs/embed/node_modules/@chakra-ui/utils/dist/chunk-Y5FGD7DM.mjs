// src/assertion.ts
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

export {
  isNumber,
  isNotNumber,
  isNumeric,
  isArray,
  isEmptyArray,
  isFunction,
  isDefined,
  isUndefined,
  isObject,
  isEmptyObject,
  isNotEmptyObject,
  isNull,
  isString,
  isCssVar,
  isEmpty,
  __DEV__,
  __TEST__,
  isRefObject,
  isInputEvent
};
