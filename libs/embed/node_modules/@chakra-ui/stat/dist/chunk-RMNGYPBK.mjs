'use client'
import {
  useStatStyles
} from "./chunk-W64KV3Y7.mjs";

// src/stat-help-text.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StatHelpText = forwardRef(
  function StatHelpText2(props, ref) {
    const styles = useStatStyles();
    return /* @__PURE__ */ jsx(
      chakra.dd,
      {
        ref,
        ...props,
        className: cx("chakra-stat__help-text", props.className),
        __css: styles.helpText
      }
    );
  }
);
StatHelpText.displayName = "StatHelpText";

export {
  StatHelpText
};
//# sourceMappingURL=chunk-RMNGYPBK.mjs.map