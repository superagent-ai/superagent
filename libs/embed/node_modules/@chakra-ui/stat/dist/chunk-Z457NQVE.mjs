'use client'
import {
  useStatStyles
} from "./chunk-W64KV3Y7.mjs";

// src/stat-label.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StatLabel = forwardRef(function StatLabel2(props, ref) {
  const styles = useStatStyles();
  return /* @__PURE__ */ jsx(
    chakra.dt,
    {
      ref,
      ...props,
      className: cx("chakra-stat__label", props.className),
      __css: styles.label
    }
  );
});
StatLabel.displayName = "StatLabel";

export {
  StatLabel
};
//# sourceMappingURL=chunk-Z457NQVE.mjs.map