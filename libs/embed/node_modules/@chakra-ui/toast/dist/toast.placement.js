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

// src/toast.placement.ts
var toast_placement_exports = {};
__export(toast_placement_exports, {
  getToastPlacement: () => getToastPlacement
});
module.exports = __toCommonJS(toast_placement_exports);
function getToastPlacement(position, dir) {
  var _a;
  const computedPosition = position != null ? position : "bottom";
  const logicals = {
    "top-start": { ltr: "top-left", rtl: "top-right" },
    "top-end": { ltr: "top-right", rtl: "top-left" },
    "bottom-start": { ltr: "bottom-left", rtl: "bottom-right" },
    "bottom-end": { ltr: "bottom-right", rtl: "bottom-left" }
  };
  const logical = logicals[computedPosition];
  return (_a = logical == null ? void 0 : logical[dir]) != null ? _a : computedPosition;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getToastPlacement
});
//# sourceMappingURL=toast.placement.js.map