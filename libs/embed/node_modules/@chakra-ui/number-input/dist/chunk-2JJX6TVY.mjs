'use client'
import {
  TriangleDownIcon,
  TriangleUpIcon
} from "./chunk-KWODBCCW.mjs";
import {
  useNumberInput
} from "./chunk-4ZJMWFQT.mjs";

// src/number-input.tsx
import { useFormControlProps } from "@chakra-ui/form-control";
import { createContext } from "@chakra-ui/react-context";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var [NumberInputStylesProvider, useNumberInputStyles] = createContext({
  name: `NumberInputStylesContext`,
  errorMessage: `useNumberInputStyles returned is 'undefined'. Seems you forgot to wrap the components in "<NumberInput />" `
});
var [NumberInputProvider, useNumberInputContext] = createContext({
  name: "NumberInputContext",
  errorMessage: "useNumberInputContext: `context` is undefined. Seems you forgot to wrap number-input's components within <NumberInput />"
});
var NumberInput = forwardRef(
  function NumberInput2(props, ref) {
    const styles = useMultiStyleConfig("NumberInput", props);
    const ownProps = omitThemingProps(props);
    const controlProps = useFormControlProps(ownProps);
    const { htmlProps, ...context } = useNumberInput(controlProps);
    const ctx = useMemo(() => context, [context]);
    return /* @__PURE__ */ jsx(NumberInputProvider, { value: ctx, children: /* @__PURE__ */ jsx(NumberInputStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...htmlProps,
        ref,
        className: cx("chakra-numberinput", props.className),
        __css: {
          position: "relative",
          zIndex: 0,
          ...styles.root
        }
      }
    ) }) });
  }
);
NumberInput.displayName = "NumberInput";
var NumberInputStepper = forwardRef(
  function NumberInputStepper2(props, ref) {
    const styles = useNumberInputStyles();
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        "aria-hidden": true,
        ref,
        ...props,
        __css: {
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "0",
          insetEnd: "0px",
          margin: "1px",
          height: "calc(100% - 2px)",
          zIndex: 1,
          ...styles.stepperGroup
        }
      }
    );
  }
);
NumberInputStepper.displayName = "NumberInputStepper";
var NumberInputField = forwardRef(
  function NumberInputField2(props, ref) {
    const { getInputProps } = useNumberInputContext();
    const input = getInputProps(props, ref);
    const styles = useNumberInputStyles();
    return /* @__PURE__ */ jsx(
      chakra.input,
      {
        ...input,
        className: cx("chakra-numberinput__field", props.className),
        __css: {
          width: "100%",
          ...styles.field
        }
      }
    );
  }
);
NumberInputField.displayName = "NumberInputField";
var StyledStepper = chakra("div", {
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    transitionProperty: "common",
    transitionDuration: "normal",
    userSelect: "none",
    cursor: "pointer",
    lineHeight: "normal"
  }
});
var NumberDecrementStepper = forwardRef(function NumberDecrementStepper2(props, ref) {
  var _a;
  const styles = useNumberInputStyles();
  const { getDecrementButtonProps } = useNumberInputContext();
  const decrement = getDecrementButtonProps(props, ref);
  return /* @__PURE__ */ jsx(StyledStepper, { ...decrement, __css: styles.stepper, children: (_a = props.children) != null ? _a : /* @__PURE__ */ jsx(TriangleDownIcon, {}) });
});
NumberDecrementStepper.displayName = "NumberDecrementStepper";
var NumberIncrementStepper = forwardRef(function NumberIncrementStepper2(props, ref) {
  var _a;
  const { getIncrementButtonProps } = useNumberInputContext();
  const increment = getIncrementButtonProps(props, ref);
  const styles = useNumberInputStyles();
  return /* @__PURE__ */ jsx(StyledStepper, { ...increment, __css: styles.stepper, children: (_a = props.children) != null ? _a : /* @__PURE__ */ jsx(TriangleUpIcon, {}) });
});
NumberIncrementStepper.displayName = "NumberIncrementStepper";

export {
  useNumberInputStyles,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  StyledStepper,
  NumberDecrementStepper,
  NumberIncrementStepper
};
//# sourceMappingURL=chunk-2JJX6TVY.mjs.map