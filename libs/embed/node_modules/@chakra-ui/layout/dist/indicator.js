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

// src/indicator.tsx
var indicator_exports = {};
__export(indicator_exports, {
  Indicator: () => Indicator
});
module.exports = __toCommonJS(indicator_exports);
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
var import_system = require("@chakra-ui/system");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Indicator = (0, import_system.forwardRef)(function Indicator2(props, ref) {
  const {
    offsetX,
    offsetY,
    offset = "0",
    placement = "top-end",
    ...rest
  } = props;
  const styles = (0, import_react.useMemo)(
    () => ({
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      insetBlockStart: (0, import_breakpoint_utils.mapResponsive)(placement, (v) => {
        const [side] = v.split("-");
        const map = {
          top: offsetY != null ? offsetY : offset,
          middle: "50%",
          bottom: "auto"
        };
        return map[side];
      }),
      insetBlockEnd: (0, import_breakpoint_utils.mapResponsive)(placement, (v) => {
        const [side] = v.split("-");
        const map = {
          top: "auto",
          middle: "50%",
          bottom: offsetY != null ? offsetY : offset
        };
        return map[side];
      }),
      insetStart: (0, import_breakpoint_utils.mapResponsive)(placement, (v) => {
        const [, align] = v.split("-");
        const map = {
          start: offsetX != null ? offsetX : offset,
          center: "50%",
          end: "auto"
        };
        return map[align];
      }),
      insetEnd: (0, import_breakpoint_utils.mapResponsive)(placement, (v) => {
        const [, align] = v.split("-");
        const map = {
          start: "auto",
          center: "50%",
          end: offsetX != null ? offsetX : offset
        };
        return map[align];
      }),
      translate: (0, import_breakpoint_utils.mapResponsive)(placement, (v) => {
        const [side, align] = v.split("-");
        const mapX = { start: "-50%", center: "-50%", end: "50%" };
        const mapY = { top: "-50%", middle: "-50%", bottom: "50%" };
        return `${mapX[align]} ${mapY[side]}`;
      })
    }),
    [offset, offsetX, offsetY, placement]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ref, __css: styles, ...rest });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Indicator
});
//# sourceMappingURL=indicator.js.map