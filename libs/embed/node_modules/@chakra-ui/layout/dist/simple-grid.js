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

// src/simple-grid.tsx
var simple_grid_exports = {};
__export(simple_grid_exports, {
  SimpleGrid: () => SimpleGrid
});
module.exports = __toCommonJS(simple_grid_exports);
var import_system2 = require("@chakra-ui/system");
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");

// src/grid.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var Grid = (0, import_system.forwardRef)(function Grid2(props, ref) {
  const {
    templateAreas,
    gap,
    rowGap,
    columnGap,
    column,
    row,
    autoFlow,
    autoRows,
    templateRows,
    autoColumns,
    templateColumns,
    ...rest
  } = props;
  const styles = {
    display: "grid",
    gridTemplateAreas: templateAreas,
    gridGap: gap,
    gridRowGap: rowGap,
    gridColumnGap: columnGap,
    gridAutoColumns: autoColumns,
    gridColumn: column,
    gridRow: row,
    gridAutoFlow: autoFlow,
    gridAutoRows: autoRows,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ref, __css: styles, ...rest });
});
Grid.displayName = "Grid";

// src/simple-grid.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var SimpleGrid = (0, import_system2.forwardRef)(
  function SimpleGrid2(props, ref) {
    const { columns, spacingX, spacingY, spacing, minChildWidth, ...rest } = props;
    const theme = (0, import_system2.useTheme)();
    const templateColumns = minChildWidth ? widthToColumns(minChildWidth, theme) : countToColumns(columns);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Grid,
      {
        ref,
        gap: spacing,
        columnGap: spacingX,
        rowGap: spacingY,
        templateColumns,
        ...rest
      }
    );
  }
);
SimpleGrid.displayName = "SimpleGrid";
function toPx(n) {
  return typeof n === "number" ? `${n}px` : n;
}
function widthToColumns(width, theme) {
  return (0, import_breakpoint_utils.mapResponsive)(width, (value) => {
    const _value = (0, import_system2.getToken)("sizes", value, toPx(value))(theme);
    return value === null ? null : `repeat(auto-fit, minmax(${_value}, 1fr))`;
  });
}
function countToColumns(count) {
  return (0, import_breakpoint_utils.mapResponsive)(
    count,
    (value) => value === null ? null : `repeat(${value}, minmax(0, 1fr))`
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SimpleGrid
});
//# sourceMappingURL=simple-grid.js.map