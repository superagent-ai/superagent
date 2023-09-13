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

// src/stat-group.tsx
var stat_group_exports = {};
__export(stat_group_exports, {
  StatGroup: () => StatGroup
});
module.exports = __toCommonJS(stat_group_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var StatGroup = (0, import_system.forwardRef)(function StatGroup2(props, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...props,
      ref,
      role: "group",
      className: (0, import_shared_utils.cx)("chakra-stat__group", props.className),
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start"
      }
    }
  );
});
StatGroup.displayName = "StatGroup";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StatGroup
});
//# sourceMappingURL=stat-group.js.map