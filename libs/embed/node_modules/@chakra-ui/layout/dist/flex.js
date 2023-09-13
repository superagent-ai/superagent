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

// src/flex.tsx
var flex_exports = {};
__export(flex_exports, {
  Flex: () => Flex
});
module.exports = __toCommonJS(flex_exports);
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var Flex = (0, import_system.forwardRef)(function Flex2(props, ref) {
  const { direction, align, justify, wrap, basis, grow, shrink, ...rest } = props;
  const styles = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ref, __css: styles, ...rest });
});
Flex.displayName = "Flex";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Flex
});
//# sourceMappingURL=flex.js.map