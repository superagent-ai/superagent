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

// src/stack/stack-divider.tsx
var stack_divider_exports = {};
__export(stack_divider_exports, {
  StackDivider: () => StackDivider
});
module.exports = __toCommonJS(stack_divider_exports);
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var StackDivider = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  import_system.chakra.div,
  {
    className: "chakra-stack__divider",
    ...props,
    __css: {
      ...props["__css"],
      borderWidth: 0,
      alignSelf: "stretch",
      borderColor: "inherit",
      width: "auto",
      height: "auto"
    }
  }
);
StackDivider.displayName = "StackDivider";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StackDivider
});
//# sourceMappingURL=stack-divider.js.map