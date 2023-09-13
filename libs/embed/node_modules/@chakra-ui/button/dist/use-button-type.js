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

// src/use-button-type.tsx
var use_button_type_exports = {};
__export(use_button_type_exports, {
  useButtonType: () => useButtonType
});
module.exports = __toCommonJS(use_button_type_exports);
var import_react = require("react");
function useButtonType(value) {
  const [isButton, setIsButton] = (0, import_react.useState)(!value);
  const refCallback = (0, import_react.useCallback)((node) => {
    if (!node)
      return;
    setIsButton(node.tagName === "BUTTON");
  }, []);
  const type = isButton ? "button" : void 0;
  return { ref: refCallback, type };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useButtonType
});
//# sourceMappingURL=use-button-type.js.map