'use client'
import {
  useInputGroupStyles
} from "./chunk-FKYN3ZGE.mjs";

// src/input-element.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var StyledInputElement = chakra("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0",
    zIndex: 2
  }
});
var InputElement = forwardRef(function InputElement2(props, ref) {
  var _a, _b;
  const { placement = "left", ...rest } = props;
  const styles = useInputGroupStyles();
  const input = styles.field;
  const attr = placement === "left" ? "insetStart" : "insetEnd";
  const elementStyles = {
    [attr]: "0",
    width: (_a = input == null ? void 0 : input.height) != null ? _a : input == null ? void 0 : input.h,
    height: (_b = input == null ? void 0 : input.height) != null ? _b : input == null ? void 0 : input.h,
    fontSize: input == null ? void 0 : input.fontSize,
    ...styles.element
  };
  return /* @__PURE__ */ jsx(StyledInputElement, { ref, __css: elementStyles, ...rest });
});
InputElement.id = "InputElement";
InputElement.displayName = "InputElement";
var InputLeftElement = forwardRef(
  function InputLeftElement2(props, ref) {
    const { className, ...rest } = props;
    const _className = cx("chakra-input__left-element", className);
    return /* @__PURE__ */ jsx(
      InputElement,
      {
        ref,
        placement: "left",
        className: _className,
        ...rest
      }
    );
  }
);
InputLeftElement.id = "InputLeftElement";
InputLeftElement.displayName = "InputLeftElement";
var InputRightElement = forwardRef(
  function InputRightElement2(props, ref) {
    const { className, ...rest } = props;
    const _className = cx("chakra-input__right-element", className);
    return /* @__PURE__ */ jsx(
      InputElement,
      {
        ref,
        placement: "right",
        className: _className,
        ...rest
      }
    );
  }
);
InputRightElement.id = "InputRightElement";
InputRightElement.displayName = "InputRightElement";

export {
  InputLeftElement,
  InputRightElement
};
//# sourceMappingURL=chunk-2ZHRCML3.mjs.map