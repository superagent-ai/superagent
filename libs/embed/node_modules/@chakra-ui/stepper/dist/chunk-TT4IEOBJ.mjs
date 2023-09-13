'use client'
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-description.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StepDescription = forwardRef(function StepDescription2(props, ref) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ jsx(
    chakra.p,
    {
      ref,
      "data-status": status,
      ...props,
      className: cx("chakra-step__description", props.className),
      __css: styles.description
    }
  );
});

export {
  StepDescription
};
//# sourceMappingURL=chunk-TT4IEOBJ.mjs.map