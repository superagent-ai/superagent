'use client'
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step.tsx
import { cx, dataAttr } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Step = forwardRef(function Step2(props, ref) {
  const { orientation, status, showLastSeparator } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      "data-status": status,
      "data-orientation": orientation,
      "data-stretch": dataAttr(showLastSeparator),
      __css: styles.step,
      ...props,
      className: cx("chakra-step", props.className)
    }
  );
});

export {
  Step
};
//# sourceMappingURL=chunk-V5KO42CT.mjs.map