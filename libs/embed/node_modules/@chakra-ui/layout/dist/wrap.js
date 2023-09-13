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

// src/wrap.tsx
var wrap_exports = {};
__export(wrap_exports, {
  Wrap: () => Wrap,
  WrapItem: () => WrapItem
});
module.exports = __toCommonJS(wrap_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Wrap = (0, import_system.forwardRef)(function Wrap2(props, ref) {
  const {
    spacing = "0.5rem",
    spacingX,
    spacingY,
    children,
    justify,
    direction,
    align,
    className,
    shouldWrapChildren,
    ...rest
  } = props;
  const _children = (0, import_react.useMemo)(
    () => shouldWrapChildren ? import_react.Children.map(children, (child, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WrapItem, { children: child }, index)) : children,
    [children, shouldWrapChildren]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ref, className: (0, import_shared_utils.cx)("chakra-wrap", className), ...rest, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.ul,
    {
      className: "chakra-wrap__list",
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        listStyleType: "none",
        gap: spacing,
        columnGap: spacingX,
        rowGap: spacingY,
        padding: "0"
      },
      children: _children
    }
  ) });
});
Wrap.displayName = "Wrap";
var WrapItem = (0, import_system.forwardRef)(function WrapItem2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.li,
    {
      ref,
      __css: { display: "flex", alignItems: "flex-start" },
      className: (0, import_shared_utils.cx)("chakra-wrap__listitem", className),
      ...rest
    }
  );
});
WrapItem.displayName = "WrapItem";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Wrap,
  WrapItem
});
//# sourceMappingURL=wrap.js.map