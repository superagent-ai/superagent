'use client'
import {
  StepStatus
} from "./chunk-ZVCNMXD3.mjs";
import {
  StepIcon
} from "./chunk-2EGA5JYM.mjs";
import {
  StepNumber
} from "./chunk-D3AI6OO6.mjs";
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-indicator.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
function StepIndicator(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      "data-status": status,
      ...props,
      __css: styles.indicator,
      className: cx("chakra-step__indicator", props.className)
    }
  );
}
function StepIndicatorContent() {
  return /* @__PURE__ */ jsx(
    StepStatus,
    {
      complete: /* @__PURE__ */ jsx(StepIcon, {}),
      incomplete: /* @__PURE__ */ jsx(StepNumber, {}),
      active: /* @__PURE__ */ jsx(StepNumber, {})
    }
  );
}

export {
  StepIndicator,
  StepIndicatorContent
};
//# sourceMappingURL=chunk-4LPX3T3V.mjs.map