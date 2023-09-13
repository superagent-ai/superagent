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

// src/stack/stack-item.tsx
var stack_item_exports = {};
__export(stack_item_exports, {
  StackItem: () => StackItem
});
module.exports = __toCommonJS(stack_item_exports);
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var StackItem = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  import_system.chakra.div,
  {
    className: "chakra-stack__item",
    ...props,
    __css: {
      display: "inline-block",
      flex: "0 0 auto",
      minWidth: 0,
      ...props["__css"]
    }
  }
);
StackItem.displayName = "StackItem";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StackItem
});
//# sourceMappingURL=stack-item.js.map