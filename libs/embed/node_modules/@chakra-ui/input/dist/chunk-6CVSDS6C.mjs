'use client'

// src/input.tsx
import { useFormControl } from "@chakra-ui/form-control";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Input = forwardRef(function Input2(props, ref) {
  const { htmlSize, ...rest } = props;
  const styles = useMultiStyleConfig("Input", rest);
  const ownProps = omitThemingProps(rest);
  const input = useFormControl(ownProps);
  const _className = cx("chakra-input", props.className);
  return /* @__PURE__ */ jsx(
    chakra.input,
    {
      size: htmlSize,
      ...input,
      __css: styles.field,
      ref,
      className: _className
    }
  );
});
Input.displayName = "Input";
Input.id = "Input";

export {
  Input
};
//# sourceMappingURL=chunk-6CVSDS6C.mjs.map