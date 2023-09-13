'use client'

// src/heading.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Heading = forwardRef(function Heading2(props, ref) {
  const styles = useStyleConfig("Heading", props);
  const { className, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(
    chakra.h2,
    {
      ref,
      className: cx("chakra-heading", props.className),
      ...rest,
      __css: styles
    }
  );
});
Heading.displayName = "Heading";

export {
  Heading
};
//# sourceMappingURL=chunk-7OLJDQMT.mjs.map