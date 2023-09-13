'use client'
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/utils.ts
import { useEffect, useLayoutEffect } from "react";
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
var useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
var cast = (value) => value;

export {
  __publicField,
  sortNodes,
  isElement,
  getNextIndex,
  getPrevIndex,
  useSafeLayoutEffect,
  cast
};
//# sourceMappingURL=chunk-3A5YOZDU.mjs.map