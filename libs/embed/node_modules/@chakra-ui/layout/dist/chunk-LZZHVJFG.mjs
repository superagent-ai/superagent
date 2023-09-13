'use client'

// src/code.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Code = forwardRef(function Code2(props, ref) {
  const styles = useStyleConfig("Code", props);
  const { className, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(
    chakra.code,
    {
      ref,
      className: cx("chakra-code", props.className),
      ...rest,
      __css: {
        display: "inline-block",
        ...styles
      }
    }
  );
});
Code.displayName = "Code";

export {
  Code
};
//# sourceMappingURL=chunk-LZZHVJFG.mjs.map