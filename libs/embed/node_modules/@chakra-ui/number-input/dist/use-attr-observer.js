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

// src/use-attr-observer.ts
var use_attr_observer_exports = {};
__export(use_attr_observer_exports, {
  useAttributeObserver: () => useAttributeObserver
});
module.exports = __toCommonJS(use_attr_observer_exports);
var import_react = require("react");
function useAttributeObserver(ref, attributes, fn, enabled) {
  (0, import_react.useEffect)(() => {
    var _a;
    if (!ref.current || !enabled)
      return;
    const win = (_a = ref.current.ownerDocument.defaultView) != null ? _a : window;
    const attrs = Array.isArray(attributes) ? attributes : [attributes];
    const obs = new win.MutationObserver((changes) => {
      for (const change of changes) {
        if (change.type === "attributes" && change.attributeName && attrs.includes(change.attributeName)) {
          fn(change);
        }
      }
    });
    obs.observe(ref.current, { attributes: true, attributeFilter: attrs });
    return () => obs.disconnect();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAttributeObserver
});
//# sourceMappingURL=use-attr-observer.js.map