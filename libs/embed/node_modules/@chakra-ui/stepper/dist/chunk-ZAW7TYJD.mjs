'use client'
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-separator.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StepSeparator = forwardRef(function StepSeparator2(props, ref) {
  const { orientation, status, isLast, showLastSeparator } = useStepContext();
  const styles = useStepperStyles();
  if (isLast && !showLastSeparator)
    return null;
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      role: "separator",
      "data-orientation": orientation,
      "data-status": status,
      __css: styles.separator,
      ...props,
      className: cx("chakra-step__separator", props.className)
    }
  );
});

export {
  StepSeparator
};
//# sourceMappingURL=chunk-ZAW7TYJD.mjs.map