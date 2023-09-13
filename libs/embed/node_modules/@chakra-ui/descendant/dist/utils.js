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

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  cast: () => cast,
  getNextIndex: () => getNextIndex,
  getPrevIndex: () => getPrevIndex,
  isElement: () => isElement,
  sortNodes: () => sortNodes,
  useSafeLayoutEffect: () => useSafeLayoutEffect
});
module.exports = __toCommonJS(utils_exports);
var import_react = require("react");
function sortNodes(nodes) {
  return nodes.sort((a, b) => {
    const compare = a.compareDocumentPosition(b);
    if (compare & Node.DOCUMENT_POSITION_FOLLOWING || compare & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return -1;
    }
    if (compare & Node.DOCUMENT_POSITION_PRECEDING || compare & Node.DOCUMENT_POSITION_CONTAINS) {
      return 1;
    }
    if (compare & Node.DOCUMENT_POSITION_DISCONNECTED || compare & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC) {
      throw Error("Cannot sort the given nodes.");
    } else {
      return 0;
    }
  });
}
var isElement = (el) => typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
function getNextIndex(current, max, loop) {
  let next = current + 1;
  if (loop && next >= max)
    next = 0;
  return next;
}
function getPrevIndex(current, max, loop) {
  let next = current - 1;
  if (loop && next < 0)
    next = max;
  return next;
}
var useSafeLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var cast = (value) => value;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cast,
  getNextIndex,
  getPrevIndex,
  isElement,
  sortNodes,
  useSafeLayoutEffect
});
//# sourceMappingURL=utils.js.map