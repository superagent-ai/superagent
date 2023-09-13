'use client'

// src/table.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { createContext } from "@chakra-ui/react-context";
import { jsx } from "react/jsx-runtime";
var [TableStylesProvider, useTableStyles] = createContext({
  name: `TableStylesContext`,
  errorMessage: `useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Table />" `
});
var Table = forwardRef((props, ref) => {
  const styles = useMultiStyleConfig("Table", props);
  const { className, layout, ...tableProps } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(TableStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
    chakra.table,
    {
      ref,
      __css: { tableLayout: layout, ...styles.table },
      className: cx("chakra-table", className),
      ...tableProps
    }
  ) });
});
Table.displayName = "Table";

export {
  useTableStyles,
  Table
};
//# sourceMappingURL=chunk-GEJVU65N.mjs.map