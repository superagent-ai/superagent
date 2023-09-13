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

// src/use-force-update.ts
var use_force_update_exports = {};
__export(use_force_update_exports, {
  useForceUpdate: () => useForceUpdate
});
module.exports = __toCommonJS(use_force_update_exports);
var import_react2 = require("react");

// src/use-unmount-effect.ts
var import_react = require("react");
function useUnmountEffect(fn, deps = []) {
  return (0, import_react.useEffect)(
    () => () => fn(),
    deps
  );
}

// src/use-force-update.ts
function useForceUpdate() {
  const unloadingRef = (0, import_react2.useRef)(false);
  const [count, setCount] = (0, import_react2.useState)(0);
  useUnmountEffect(() => {
    unloadingRef.current = true;
  });
  return (0, import_react2.useCallback)(() => {
    if (!unloadingRef.current) {
      setCount(count + 1);
    }
  }, [count]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useForceUpdate
});
