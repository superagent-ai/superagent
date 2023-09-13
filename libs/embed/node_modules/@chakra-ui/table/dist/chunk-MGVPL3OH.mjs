'use client'
import {
  useTableStyles
} from "./chunk-GEJVU65N.mjs";

// src/th.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Th = forwardRef(
  ({ isNumeric, ...rest }, ref) => {
    const styles = useTableStyles();
    return /* @__PURE__ */ jsx(
      chakra.th,
      {
        ...rest,
        ref,
        __css: styles.th,
        "data-is-numeric": isNumeric
      }
    );
  }
);

export {
  Th
};
//# sourceMappingURL=chunk-MGVPL3OH.mjs.map