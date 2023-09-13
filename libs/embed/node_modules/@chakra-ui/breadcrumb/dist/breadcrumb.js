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

// src/breadcrumb.tsx
var breadcrumb_exports = {};
__export(breadcrumb_exports, {
  Breadcrumb: () => Breadcrumb
});
module.exports = __toCommonJS(breadcrumb_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_system = require("@chakra-ui/system");
var import_react = require("react");

// src/breadcrumb-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [BreadcrumbStylesProvider, useBreadcrumbStyles] = (0, import_react_context.createContext)({
  name: `BreadcrumbStylesContext`,
  errorMessage: `useBreadcrumbStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Breadcrumb />" `
});

// src/breadcrumb.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Breadcrumb = (0, import_system.forwardRef)(
  function Breadcrumb2(props, ref) {
    const styles = (0, import_system.useMultiStyleConfig)("Breadcrumb", props);
    const ownProps = (0, import_system.omitThemingProps)(props);
    const {
      children,
      spacing = "0.5rem",
      separator = "/",
      className,
      listProps,
      ...rest
    } = ownProps;
    const validChildren = (0, import_react_children_utils.getValidChildren)(children);
    const count = validChildren.length;
    const clones = validChildren.map(
      (child, index) => (0, import_react.cloneElement)(child, {
        separator,
        spacing,
        isLastChild: count === index + 1
      })
    );
    const _className = (0, import_shared_utils.cx)("chakra-breadcrumb", className);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.nav,
      {
        ref,
        "aria-label": "breadcrumb",
        className: _className,
        __css: styles.container,
        ...rest,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_system.chakra.ol,
          {
            className: "chakra-breadcrumb__list",
            ...listProps,
            __css: {
              display: "flex",
              alignItems: "center",
              ...styles.list
            },
            children: clones
          }
        ) })
      }
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Breadcrumb
});
//# sourceMappingURL=breadcrumb.js.map