'use client'

// src/table-container.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var TableContainer = forwardRef(
  (props, ref) => {
    var _a;
    const { overflow, overflowX, className, ...rest } = props;
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        className: cx("chakra-table__container", className),
        ...rest,
        __css: {
          display: "block",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          overflowX: (_a = overflow != null ? overflow : overflowX) != null ? _a : "auto",
          overflowY: "hidden",
          maxWidth: "100%"
        }
      }
    );
  }
);

export {
  TableContainer
};
//# sourceMappingURL=chunk-OA6OURRG.mjs.map