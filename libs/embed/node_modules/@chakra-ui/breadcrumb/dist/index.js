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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Breadcrumb: () => Breadcrumb,
  BreadcrumbItem: () => BreadcrumbItem,
  BreadcrumbLink: () => BreadcrumbLink,
  BreadcrumbSeparator: () => BreadcrumbSeparator,
  useBreadcrumbStyles: () => useBreadcrumbStyles
});
module.exports = __toCommonJS(src_exports);

// src/breadcrumb.tsx
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

// src/breadcrumb-item.tsx
var import_system4 = require("@chakra-ui/system");
var import_react_children_utils2 = require("@chakra-ui/react-children-utils");
var import_shared_utils3 = require("@chakra-ui/shared-utils");

// src/breadcrumb-separator.tsx
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var BreadcrumbSeparator = (0, import_system2.forwardRef)(
  function BreadcrumbSeparator2(props, ref) {
    const { spacing, ...rest } = props;
    const styles = useBreadcrumbStyles();
    const separatorStyles = {
      mx: spacing,
      ...styles.separator
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.span,
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

// src/breadcrumb-link.tsx
var import_system3 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var BreadcrumbLink = (0, import_system3.forwardRef)(
  function BreadcrumbLink2(props, ref) {
    const { isCurrentPage, as, className, href, ...rest } = props;
    const styles = useBreadcrumbStyles();
    const sharedProps = {
      ref,
      as,
      className: (0, import_shared_utils2.cx)("chakra-breadcrumb__link", className),
      ...rest
    };
    if (isCurrentPage) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_system3.chakra.span, { "aria-current": "page", __css: styles.link, ...sharedProps });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_system3.chakra.a, { __css: styles.link, href, ...sharedProps });
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

// src/breadcrumb-item.tsx
var import_react2 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var BreadcrumbItem = (0, import_system4.forwardRef)(
  function BreadcrumbItem2(props, ref) {
    const {
      isCurrentPage,
      separator,
      isLastChild,
      spacing,
      children,
      className,
      ...rest
    } = props;
    const validChildren = (0, import_react_children_utils2.getValidChildren)(children);
    const clones = validChildren.map((child) => {
      if (child.type === BreadcrumbLink) {
        return (0, import_react2.cloneElement)(child, {
          isCurrentPage
        });
      }
      if (child.type === BreadcrumbSeparator) {
        return (0, import_react2.cloneElement)(child, {
          spacing,
          children: child.props.children || separator
        });
      }
      return child;
    });
    const styles = useBreadcrumbStyles();
    const itemStyles = {
      display: "inline-flex",
      alignItems: "center",
      ...styles.item
    };
    const _className = (0, import_shared_utils3.cx)("chakra-breadcrumb__list-item", className);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_system4.chakra.li, { ref, className: _className, ...rest, __css: itemStyles, children: [
      clones,
      !isLastChild && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BreadcrumbSeparator, { spacing, children: separator })
    ] });
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  useBreadcrumbStyles
});
//# sourceMappingURL=index.js.map