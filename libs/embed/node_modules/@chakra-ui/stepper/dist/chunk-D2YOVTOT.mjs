'use client'
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-title.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StepTitle = forwardRef(function StepTitle2(props, ref) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ jsx(
    chakra.h3,
    {
      ref,
      "data-status": status,
      ...props,
      __css: styles.title,
      className: cx("chakra-step__title", props.className)
    }
  );
});

export {
  StepTitle
};
//# sourceMappingURL=chunk-D2YOVTOT.mjs.map