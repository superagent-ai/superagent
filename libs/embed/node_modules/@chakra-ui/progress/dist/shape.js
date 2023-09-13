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

// src/shape.tsx
var shape_exports = {};
__export(shape_exports, {
  Shape: () => Shape
});
module.exports = __toCommonJS(shape_exports);
var import_system2 = require("@chakra-ui/system");

// src/progress.utils.tsx
var import_system = require("@chakra-ui/system");
var spin = (0, import_system.keyframes)({
  "0%": {
    strokeDasharray: "1, 400",
    strokeDashoffset: "0"
  },
  "50%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-100"
  },
  "100%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-260"
  }
});
var rotate = (0, import_system.keyframes)({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
var progress = (0, import_system.keyframes)({
  "0%": { left: "-40%" },
  "100%": { left: "100%" }
});
var stripe = (0, import_system.keyframes)({
  from: { backgroundPosition: "1rem 0" },
  to: { backgroundPosition: "0 0" }
});

// src/shape.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Shape = (props) => {
  const { size, isIndeterminate, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.svg,
    {
      viewBox: "0 0 100 100",
      __css: {
        width: size,
        height: size,
        animation: isIndeterminate ? `${rotate} 2s linear infinite` : void 0
      },
      ...rest
    }
  );
};
Shape.displayName = "Shape";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Shape
});
//# sourceMappingURL=shape.js.map