'use client'
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-number.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StepNumber = forwardRef(function StepNumber2(props, ref) {
  const { children, ...restProps } = props;
  const { status, index } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      "data-status": status,
      __css: styles.number,
      ...restProps,
      className: cx("chakra-step__number", props.className),
      children: children || index + 1
    }
  );
});

export {
  StepNumber
};
//# sourceMappingURL=chunk-D3AI6OO6.mjs.map