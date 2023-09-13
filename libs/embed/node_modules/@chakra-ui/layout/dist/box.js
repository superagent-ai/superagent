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

// src/box.tsx
var box_exports = {};
__export(box_exports, {
  Box: () => Box,
  Circle: () => Circle,
  Square: () => Square
});
module.exports = __toCommonJS(box_exports);
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var Box = (0, import_system.chakra)("div");
Box.displayName = "Box";
var Square = (0, import_system.forwardRef)(function Square2(props, ref) {
  const { size, centerContent = true, ...rest } = props;
  const styles = centerContent ? { display: "flex", alignItems: "center", justifyContent: "center" } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Box,
    {
      ref,
      boxSize: size,
      __css: {
        ...styles,
        flexShrink: 0,
        flexGrow: 0
      },
      ...rest
    }
  );
});
Square.displayName = "Square";
var Circle = (0, import_system.forwardRef)(function Circle2(props, ref) {
  const { size, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { size, ref, borderRadius: "9999px", ...rest });
});
Circle.displayName = "Circle";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Box,
  Circle,
  Square
});
//# sourceMappingURL=box.js.map