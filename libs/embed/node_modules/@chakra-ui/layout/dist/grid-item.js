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

// src/grid-item.tsx
var grid_item_exports = {};
__export(grid_item_exports, {
  GridItem: () => GridItem
});
module.exports = __toCommonJS(grid_item_exports);
var import_system = require("@chakra-ui/system");
var import_object_utils = require("@chakra-ui/object-utils");
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
var import_jsx_runtime = require("react/jsx-runtime");
function spanFn(span) {
  return (0, import_breakpoint_utils.mapResponsive)(
    span,
    (value) => value === "auto" ? "auto" : `span ${value}/span ${value}`
  );
}
var GridItem = (0, import_system.forwardRef)(function GridItem2(props, ref) {
  const {
    area,
    colSpan,
    colStart,
    colEnd,
    rowEnd,
    rowSpan,
    rowStart,
    ...rest
  } = props;
  const styles = (0, import_object_utils.compact)({
    gridArea: area,
    gridColumn: spanFn(colSpan),
    gridRow: spanFn(rowSpan),
    gridColumnStart: colStart,
    gridColumnEnd: colEnd,
    gridRowStart: rowStart,
    gridRowEnd: rowEnd
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ref, __css: styles, ...rest });
});
GridItem.displayName = "GridItem";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GridItem
});
//# sourceMappingURL=grid-item.js.map