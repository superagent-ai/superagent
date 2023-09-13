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
  getEventWindow: () => getEventWindow,
  isMouseEvent: () => isMouseEvent,
  isMultiTouchEvent: () => isMultiTouchEvent,
  isTouchEvent: () => isTouchEvent
});
module.exports = __toCommonJS(assertion_exports);
function isMouseEvent(event) {
  const win = getEventWindow(event);
  if (typeof win.PointerEvent !== "undefined" && event instanceof win.PointerEvent) {
    return !!(event.pointerType === "mouse");
  }
  return event instanceof win.MouseEvent;
}
function isTouchEvent(event) {
  const hasTouches = !!event.touches;
  return hasTouches;
}
function isMultiTouchEvent(event) {
  return isTouchEvent(event) && event.touches.length > 1;
}
function getEventWindow(event) {
  var _a;
  return (_a = event.view) != null ? _a : window;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEventWindow,
  isMouseEvent,
  isMultiTouchEvent,
  isTouchEvent
});
