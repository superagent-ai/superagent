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

// src/use-is-first-render.ts
var use_is_first_render_exports = {};
__export(use_is_first_render_exports, {
  useIsFirstRender: () => useIsFirstRender
});
module.exports = __toCommonJS(use_is_first_render_exports);
var import_react = require("react");
function useIsFirstRender() {
  const isFirstRender = (0, import_react.useRef)(true);
  (0, import_react.useEffect)(() => {
    isFirstRender.current = false;
  }, []);
  return isFirstRender.current;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsFirstRender
});
//# sourceMappingURL=use-is-first-render.js.map