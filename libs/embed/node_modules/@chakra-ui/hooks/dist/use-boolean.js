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

// src/use-boolean.ts
var use_boolean_exports = {};
__export(use_boolean_exports, {
  useBoolean: () => useBoolean
});
module.exports = __toCommonJS(use_boolean_exports);
var import_react = require("react");
function useBoolean(initialState = false) {
  const [value, setValue] = (0, import_react.useState)(initialState);
  const callbacks = (0, import_react.useMemo)(
    () => ({
      on: () => setValue(true),
      off: () => setValue(false),
      toggle: () => setValue((prev) => !prev)
    }),
    []
  );
  return [value, callbacks];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBoolean
});
