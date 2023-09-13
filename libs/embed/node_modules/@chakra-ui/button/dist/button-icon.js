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

// src/button-icon.tsx
var button_icon_exports = {};
__export(button_icon_exports, {
  ButtonIcon: () => ButtonIcon
});
module.exports = __toCommonJS(button_icon_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function ButtonIcon(props) {
  const { children, className, ...rest } = props;
  const _children = (0, import_react.isValidElement)(children) ? (0, import_react.cloneElement)(children, {
    "aria-hidden": true,
    focusable: false
  }) : children;
  const _className = (0, import_shared_utils.cx)("chakra-button__icon", className);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.span,
    {
      display: "inline-flex",
      alignSelf: "center",
      flexShrink: 0,
      ...rest,
      className: _className,
      children: _children
    }
  );
}
ButtonIcon.displayName = "ButtonIcon";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ButtonIcon
});
//# sourceMappingURL=button-icon.js.map