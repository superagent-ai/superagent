'use client'
import {
  PinInputDescendantsProvider,
  PinInputProvider,
  usePinInput,
  usePinInputField
} from "./chunk-7FMJRAMH.mjs";

// src/pin-input.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { getValidChildren } from "@chakra-ui/react-children-utils";
import { cloneElement } from "react";
import { jsx } from "react/jsx-runtime";
function PinInput(props) {
  const styles = useStyleConfig("PinInput", props);
  const { children, ...rest } = omitThemingProps(props);
  const { descendants, ...context } = usePinInput(rest);
  const clones = getValidChildren(children).map(
    (child) => cloneElement(child, { __css: styles })
  );
  return /* @__PURE__ */ jsx(PinInputDescendantsProvider, { value: descendants, children: /* @__PURE__ */ jsx(PinInputProvider, { value: context, children: clones }) });
}
PinInput.displayName = "PinInput";
var PinInputField = forwardRef(
  function PinInputField2(props, ref) {
    const inputProps = usePinInputField(props, ref);
    return /* @__PURE__ */ jsx(
      chakra.input,
      {
        ...inputProps,
        className: cx("chakra-pin-input", props.className)
      }
    );
  }
);
PinInputField.displayName = "PinInputField";

export {
  PinInput,
  PinInputField
};
//# sourceMappingURL=chunk-I5V4ORUK.mjs.map