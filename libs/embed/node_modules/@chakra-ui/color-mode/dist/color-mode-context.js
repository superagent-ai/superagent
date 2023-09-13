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

// src/color-mode-context.ts
var color_mode_context_exports = {};
__export(color_mode_context_exports, {
  ColorModeContext: () => ColorModeContext,
  useColorMode: () => useColorMode,
  useColorModeValue: () => useColorModeValue
});
module.exports = __toCommonJS(color_mode_context_exports);
var import_react = require("react");
var ColorModeContext = (0, import_react.createContext)({});
ColorModeContext.displayName = "ColorModeContext";
function useColorMode() {
  const context = (0, import_react.useContext)(ColorModeContext);
  if (context === void 0) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}
function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorModeContext,
  useColorMode,
  useColorModeValue
});
//# sourceMappingURL=color-mode-context.js.map