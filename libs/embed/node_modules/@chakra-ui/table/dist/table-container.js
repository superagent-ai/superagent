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

// src/table-container.tsx
var table_container_exports = {};
__export(table_container_exports, {
  TableContainer: () => TableContainer
});
module.exports = __toCommonJS(table_container_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var TableContainer = (0, import_system.forwardRef)(
  (props, ref) => {
    var _a;
    const { overflow, overflowX, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        className: (0, import_shared_utils.cx)("chakra-table__container", className),
        ...rest,
        __css: {
          display: "block",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          overflowX: (_a = overflow != null ? overflow : overflowX) != null ? _a : "auto",
          overflowY: "hidden",
          maxWidth: "100%"
        }
      }
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TableContainer
});
//# sourceMappingURL=table-container.js.map