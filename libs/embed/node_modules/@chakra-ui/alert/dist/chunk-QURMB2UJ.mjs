'use client'
import {
  useAlertContext,
  useAlertStyles
} from "./chunk-XCES3W5V.mjs";

// src/alert-title.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var AlertTitle = forwardRef(
  function AlertTitle2(props, ref) {
    const styles = useAlertStyles();
    const { status } = useAlertContext();
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        "data-status": status,
        ...props,
        className: cx("chakra-alert__title", props.className),
        __css: styles.title
      }
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export {
  AlertTitle
};
//# sourceMappingURL=chunk-QURMB2UJ.mjs.map