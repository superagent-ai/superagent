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

// src/visually-hidden.tsx
var visually_hidden_exports = {};
__export(visually_hidden_exports, {
  VisuallyHidden: () => VisuallyHidden,
  VisuallyHiddenInput: () => VisuallyHiddenInput,
  default: () => visually_hidden_default
});
module.exports = __toCommonJS(visually_hidden_exports);
var import_system = require("@chakra-ui/system");

// src/visually-hidden.style.ts
var visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0, 0, 0, 0)",
  height: "1px",
  width: "1px",
  margin: "-1px",
  padding: "0",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute"
};

// src/visually-hidden.tsx
var VisuallyHidden = (0, import_system.chakra)("span", {
  baseStyle: visuallyHiddenStyle
});
VisuallyHidden.displayName = "VisuallyHidden";
var VisuallyHiddenInput = (0, import_system.chakra)("input", {
  baseStyle: visuallyHiddenStyle
});
VisuallyHiddenInput.displayName = "VisuallyHiddenInput";
var visually_hidden_default = VisuallyHidden;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VisuallyHidden,
  VisuallyHiddenInput
});
//# sourceMappingURL=visually-hidden.js.map