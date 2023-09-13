'use client'

// src/grid.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Grid = forwardRef(function Grid2(props, ref) {
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
  return /* @__PURE__ */ jsx(chakra.div, { ref, __css: styles, ...rest });
});
Grid.displayName = "Grid";

export {
  Grid
};
//# sourceMappingURL=chunk-JARCRF6W.mjs.map