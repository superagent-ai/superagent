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

// src/checkbox-icon.tsx
var checkbox_icon_exports = {};
__export(checkbox_icon_exports, {
  CheckboxIcon: () => CheckboxIcon
});
module.exports = __toCommonJS(checkbox_icon_exports);
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
function CheckIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.svg,
    {
      width: "1.2em",
      viewBox: "0 0 12 10",
      style: {
        fill: "none",
        strokeWidth: 2,
        stroke: "currentColor",
        strokeDasharray: 16
      },
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "1.5 6 4.5 9 10.5 1" })
    }
  );
}
function IndeterminateIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.svg,
    {
      width: "1.2em",
      viewBox: "0 0 24 24",
      style: { stroke: "currentColor", strokeWidth: 4 },
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "21", x2: "3", y1: "12", y2: "12" })
    }
  );
}
function CheckboxIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;
  const BaseIcon = isIndeterminate ? IndeterminateIcon : CheckIcon;
  return isChecked || isIndeterminate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaseIcon, { ...rest })
    }
  ) : null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CheckboxIcon
});
//# sourceMappingURL=checkbox-icon.js.map