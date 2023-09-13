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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useSize: () => useSize,
  useSizes: () => useSizes
});
module.exports = __toCommonJS(src_exports);
var import_element_size = require("@zag-js/element-size");
var import_react = require("react");
var useSafeLayoutEffect = Boolean(globalThis == null ? void 0 : globalThis.document) ? import_react.useLayoutEffect : import_react.useEffect;
function trackMutation(el, cb) {
  var _a, _b;
  if (!el || !el.parentElement)
    return;
  const win = (_b = (_a = el.ownerDocument) == null ? void 0 : _a.defaultView) != null ? _b : window;
  const observer = new win.MutationObserver(() => {
    cb();
  });
  observer.observe(el.parentElement, { childList: true });
  return () => {
    observer.disconnect();
  };
}
function useSizes({
  getNodes,
  observeMutation = true
}) {
  const [sizes, setSizes] = (0, import_react.useState)([]);
  const [count, setCount] = (0, import_react.useState)(0);
  useSafeLayoutEffect(() => {
    const elements = getNodes();
    const cleanups = elements.map(
      (element, index) => (0, import_element_size.trackElementSize)(element, (size) => {
        setSizes((sizes2) => {
          return [
            ...sizes2.slice(0, index),
            size,
            ...sizes2.slice(index + 1)
          ];
        });
      })
    );
    if (observeMutation) {
      const firstNode = elements[0];
      cleanups.push(
        trackMutation(firstNode, () => {
          setCount((count2) => count2 + 1);
        })
      );
    }
    return () => {
      cleanups.forEach((cleanup) => {
        cleanup == null ? void 0 : cleanup();
      });
    };
  }, [count]);
  return sizes;
}
function isRef(ref) {
  return typeof ref === "object" && ref !== null && "current" in ref;
}
function useSize(subject) {
  const [size] = useSizes({
    observeMutation: false,
    getNodes() {
      const node = isRef(subject) ? subject.current : subject;
      return [node];
    }
  });
  return size;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSize,
  useSizes
});
//# sourceMappingURL=index.js.map