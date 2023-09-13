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

// src/tr.tsx
var tr_exports = {};
__export(tr_exports, {
  Tr: () => Tr
});
module.exports = __toCommonJS(tr_exports);
var import_system2 = require("@chakra-ui/system");

// src/table.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_context = require("@chakra-ui/react-context");
var import_jsx_runtime = require("react/jsx-runtime");
var [TableStylesProvider, useTableStyles] = (0, import_react_context.createContext)({
  name: `TableStylesContext`,
  errorMessage: `useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Table />" `
});
var Table = (0, import_system.forwardRef)((props, ref) => {
  const styles = (0, import_system.useMultiStyleConfig)("Table", props);
  const { className, layout, ...tableProps } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.table,
    {
      ref,
      __css: { tableLayout: layout, ...styles.table },
      className: (0, import_shared_utils.cx)("chakra-table", className),
      ...tableProps
    }
  ) });
});
Table.displayName = "Table";

// src/tr.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Tr = (0, import_system2.forwardRef)((props, ref) => {
  const styles = useTableStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system2.chakra.tr, { ...props, ref, __css: styles.tr });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tr
});
//# sourceMappingURL=tr.js.map