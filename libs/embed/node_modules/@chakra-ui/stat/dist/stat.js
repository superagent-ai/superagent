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

// src/stat.tsx
var stat_exports = {};
__export(stat_exports, {
  Stat: () => Stat,
  useStatStyles: () => useStatStyles
});
module.exports = __toCommonJS(stat_exports);
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var [StatStylesProvider, useStatStyles] = (0, import_react_context.createContext)({
  name: `StatStylesContext`,
  errorMessage: `useStatStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Stat />" `
});
var Stat = (0, import_system.forwardRef)(function Stat2(props, ref) {
  const styles = (0, import_system.useMultiStyleConfig)("Stat", props);
  const statStyles = {
    position: "relative",
    flex: "1 1 0%",
    ...styles.container
  };
  const { className, children, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      ...rest,
      className: (0, import_shared_utils.cx)("chakra-stat", className),
      __css: statStyles,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children })
    }
  ) });
});
Stat.displayName = "Stat";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Stat,
  useStatStyles
});
//# sourceMappingURL=stat.js.map