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

// src/use-merge-refs.ts
var use_merge_refs_exports = {};
__export(use_merge_refs_exports, {
  assignRef: () => assignRef,
  useMergeRefs: () => useMergeRefs
});
module.exports = __toCommonJS(use_merge_refs_exports);
var import_react = require("react");
function assignRef(ref, value) {
  if (ref == null)
    return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  try {
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}
function useMergeRefs(...refs) {
  return (0, import_react.useMemo)(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (node) => {
      refs.forEach((ref) => {
        if (ref)
          assignRef(ref, node);
      });
    };
  }, refs);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assignRef,
  useMergeRefs
});
