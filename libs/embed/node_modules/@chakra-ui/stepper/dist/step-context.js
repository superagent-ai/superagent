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

// src/step-context.tsx
var step_context_exports = {};
__export(step_context_exports, {
  StepContextProvider: () => StepContextProvider,
  StepperStylesProvider: () => StepperStylesProvider,
  useStepContext: () => useStepContext,
  useStepperStyles: () => useStepperStyles
});
module.exports = __toCommonJS(step_context_exports);
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StepContextProvider,
  StepperStylesProvider,
  useStepContext,
  useStepperStyles
});
//# sourceMappingURL=step-context.js.map