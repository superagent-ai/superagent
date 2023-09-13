'use client'
import {
  useTableStyles
} from "./chunk-GEJVU65N.mjs";

// src/table-caption.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var TableCaption = forwardRef(
  (props, ref) => {
    const { placement = "bottom", ...rest } = props;
    const styles = useTableStyles();
    return /* @__PURE__ */ jsx(
      chakra.caption,
      {
        ...rest,
        ref,
        __css: {
          ...styles.caption,
          captionSide: placement
        }
      }
    );
  }
);
TableCaption.displayName = "TableCaption";

export {
  TableCaption
};
//# sourceMappingURL=chunk-V3K6UINC.mjs.map