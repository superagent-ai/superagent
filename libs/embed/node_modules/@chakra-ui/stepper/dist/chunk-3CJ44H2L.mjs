'use client'
import {
  StepContextProvider,
  StepperStylesProvider
} from "./chunk-5JULEEQD.mjs";

// src/stepper.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { Children } from "react";
import { jsx } from "react/jsx-runtime";
var Stepper = forwardRef(function Stepper2(props, ref) {
  const styles = useMultiStyleConfig("Stepper", props);
  const {
    children,
    index,
    orientation = "horizontal",
    showLastSeparator = false,
    ...restProps
  } = omitThemingProps(props);
  const stepElements = Children.toArray(children);
  const stepCount = stepElements.length;
  function getStatus(step) {
    if (step < index)
      return "complete";
    if (step > index)
      return "incomplete";
    return "active";
  }
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      "aria-label": "Progress",
      "data-orientation": orientation,
      ...restProps,
      __css: styles.stepper,
      className: cx("chakra-stepper", props.className),
      children: /* @__PURE__ */ jsx(StepperStylesProvider, { value: styles, children: stepElements.map((child, index2) => /* @__PURE__ */ jsx(
        StepContextProvider,
        {
          value: {
            index: index2,
            status: getStatus(index2),
            orientation,
            showLastSeparator,
            count: stepCount,
            isFirst: index2 === 0,
            isLast: index2 === stepCount - 1
          },
          children: child
        },
        index2
      )) })
    }
  );
});

export {
  Stepper
};
//# sourceMappingURL=chunk-3CJ44H2L.mjs.map