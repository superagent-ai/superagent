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

// src/use-update-effect.ts
var use_update_effect_exports = {};
__export(use_update_effect_exports, {
  useUpdateEffect: () => useUpdateEffect
});
module.exports = __toCommonJS(use_update_effect_exports);
var import_react = require("react");
var useUpdateEffect = (effect, deps) => {
  const renderCycleRef = (0, import_react.useRef)(false);
  const effectCycleRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    const isMounted = renderCycleRef.current;
    const shouldRun = isMounted && effectCycleRef.current;
    if (shouldRun) {
      return effect();
    }
    effectCycleRef.current = true;
  }, deps);
  (0, import_react.useEffect)(() => {
    renderCycleRef.current = true;
    return () => {
      renderCycleRef.current = false;
    };
  }, []);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useUpdateEffect
});
