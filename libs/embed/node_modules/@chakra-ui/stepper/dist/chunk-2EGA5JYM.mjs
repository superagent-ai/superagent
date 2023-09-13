'use client'
import {
  CheckIcon
} from "./chunk-BHFVWI2H.mjs";
import {
  useStepContext,
  useStepperStyles
} from "./chunk-5JULEEQD.mjs";

// src/step-icon.tsx
import { Icon } from "@chakra-ui/icon";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
function StepIcon(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  const icon = status === "complete" ? CheckIcon : void 0;
  return /* @__PURE__ */ jsx(
    Icon,
    {
      as: icon,
      __css: styles.icon,
      ...props,
      className: cx("chakra-step__icon", props.className)
    }
  );
}

export {
  StepIcon
};
//# sourceMappingURL=chunk-2EGA5JYM.mjs.map