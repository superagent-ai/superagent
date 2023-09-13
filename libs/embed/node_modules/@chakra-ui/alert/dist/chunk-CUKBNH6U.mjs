'use client'
import {
  useAlertContext,
  useAlertStyles
} from "./chunk-XCES3W5V.mjs";

// src/alert-description.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var AlertDescription = forwardRef(
  function AlertDescription2(props, ref) {
    const styles = useAlertStyles();
    const { status } = useAlertContext();
    const descriptionStyles = {
      display: "inline",
      ...styles.description
    };
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        "data-status": status,
        ...props,
        className: cx("chakra-alert__desc", props.className),
        __css: descriptionStyles
      }
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export {
  AlertDescription
};
//# sourceMappingURL=chunk-CUKBNH6U.mjs.map