'use client'
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

// src/toast.utils.ts
var toast_utils_exports = {};
__export(toast_utils_exports, {
  findById: () => findById,
  findToast: () => findToast,
  getToastListStyle: () => getToastListStyle,
  getToastPosition: () => getToastPosition,
  getToastStyle: () => getToastStyle,
  isVisible: () => isVisible
});
module.exports = __toCommonJS(toast_utils_exports);
var findById = (arr, id) => arr.find((toast) => toast.id === id);
function findToast(toasts, id) {
  const position = getToastPosition(toasts, id);
  const index = position ? toasts[position].findIndex((toast) => toast.id === id) : -1;
  return {
    position,
    index
  };
}
function getToastPosition(toasts, id) {
  for (const [position, values] of Object.entries(toasts)) {
    if (findById(values, id)) {
      return position;
    }
  }
}
var isVisible = (toasts, id) => !!getToastPosition(toasts, id);
function getToastStyle(position) {
  const isRighty = position.includes("right");
  const isLefty = position.includes("left");
  let alignItems = "center";
  if (isRighty)
    alignItems = "flex-end";
  if (isLefty)
    alignItems = "flex-start";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems
  };
}
function getToastListStyle(position) {
  const isTopOrBottom = position === "top" || position === "bottom";
  const margin = isTopOrBottom ? "0 auto" : void 0;
  const top = position.includes("top") ? "env(safe-area-inset-top, 0px)" : void 0;
  const bottom = position.includes("bottom") ? "env(safe-area-inset-bottom, 0px)" : void 0;
  const right = !position.includes("left") ? "env(safe-area-inset-right, 0px)" : void 0;
  const left = !position.includes("right") ? "env(safe-area-inset-left, 0px)" : void 0;
  return {
    position: "fixed",
    zIndex: "var(--toast-z-index, 5500)",
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    margin,
    top,
    bottom,
    right,
    left
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findById,
  findToast,
  getToastListStyle,
  getToastPosition,
  getToastStyle,
  isVisible
});
//# sourceMappingURL=toast.utils.js.map