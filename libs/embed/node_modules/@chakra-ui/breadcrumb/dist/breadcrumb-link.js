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

// src/breadcrumb-link.tsx
var breadcrumb_link_exports = {};
__export(breadcrumb_link_exports, {
  BreadcrumbLink: () => BreadcrumbLink
});
module.exports = __toCommonJS(breadcrumb_link_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/breadcrumb-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [BreadcrumbStylesProvider, useBreadcrumbStyles] = (0, import_react_context.createContext)({
  name: `BreadcrumbStylesContext`,
  errorMessage: `useBreadcrumbStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Breadcrumb />" `
});

// src/breadcrumb-link.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var BreadcrumbLink = (0, import_system.forwardRef)(
  function BreadcrumbLink2(props, ref) {
    const { isCurrentPage, as, className, href, ...rest } = props;
    const styles = useBreadcrumbStyles();
    const sharedProps = {
      ref,
      as,
      className: (0, import_shared_utils.cx)("chakra-breadcrumb__link", className),
      ...rest
    };
    if (isCurrentPage) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.span, { "aria-current": "page", __css: styles.link, ...sharedProps });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.a, { __css: styles.link, href, ...sharedProps });
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BreadcrumbLink
});
//# sourceMappingURL=breadcrumb-link.js.map