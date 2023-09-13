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

// src/divider.tsx
var divider_exports = {};
__export(divider_exports, {
  Divider: () => Divider
});
module.exports = __toCommonJS(divider_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Divider = (0, import_system.forwardRef)(function Divider2(props, ref) {
  const {
    borderLeftWidth,
    borderBottomWidth,
    borderTopWidth,
    borderRightWidth,
    borderWidth,
    borderStyle,
    borderColor,
    ...styles
  } = (0, import_system.useStyleConfig)("Divider", props);
  const {
    className,
    orientation = "horizontal",
    __css,
    ...rest
  } = (0, import_system.omitThemingProps)(props);
  const dividerStyles = {
    vertical: {
      borderLeftWidth: borderLeftWidth || borderRightWidth || borderWidth || "1px",
      height: "100%"
    },
    horizontal: {
      borderBottomWidth: borderBottomWidth || borderTopWidth || borderWidth || "1px",
      width: "100%"
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.hr,
    {
      ref,
      "aria-orientation": orientation,
      ...rest,
      __css: {
        ...styles,
        border: "0",
        borderColor,
        borderStyle,
        ...dividerStyles[orientation],
        ...__css
      },
      className: (0, import_shared_utils.cx)("chakra-divider", className)
    }
  );
});
Divider.displayName = "Divider";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Divider
});
//# sourceMappingURL=divider.js.map