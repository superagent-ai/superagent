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

// src/breadcrumb-separator.tsx
var breadcrumb_separator_exports = {};
__export(breadcrumb_separator_exports, {
  BreadcrumbSeparator: () => BreadcrumbSeparator
});
module.exports = __toCommonJS(breadcrumb_separator_exports);
var import_system = require("@chakra-ui/system");

// src/breadcrumb-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [BreadcrumbStylesProvider, useBreadcrumbStyles] = (0, import_react_context.createContext)({
  name: `BreadcrumbStylesContext`,
  errorMessage: `useBreadcrumbStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Breadcrumb />" `
});

// src/breadcrumb-separator.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var BreadcrumbSeparator = (0, import_system.forwardRef)(
  function BreadcrumbSeparator2(props, ref) {
    const { spacing, ...rest } = props;
    const styles = useBreadcrumbStyles();
    const separatorStyles = {
      mx: spacing,
      ...styles.separator
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.span,
      {
        ref,
        role: "presentation",
        ...rest,
        __css: separatorStyles
      }
    );
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BreadcrumbSeparator
});
//# sourceMappingURL=breadcrumb-separator.js.map