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

// src/use-initial-animation-state.tsx
var use_initial_animation_state_exports = {};
__export(use_initial_animation_state_exports, {
  useInitialAnimationState: () => useInitialAnimationState
});
module.exports = __toCommonJS(use_initial_animation_state_exports);
var import_react = require("react");
function useInitialAnimationState(isChecked) {
  const [previousIsChecked, setPreviousIsChecked] = (0, import_react.useState)(isChecked);
  const [shouldAnimate, setShouldAnimate] = (0, import_react.useState)(false);
  if (isChecked !== previousIsChecked) {
    setShouldAnimate(true);
    setPreviousIsChecked(isChecked);
  }
  return shouldAnimate;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useInitialAnimationState
});
//# sourceMappingURL=use-initial-animation-state.js.map