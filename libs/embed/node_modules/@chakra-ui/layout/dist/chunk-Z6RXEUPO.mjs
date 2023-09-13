'use client'

// src/badge.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Badge = forwardRef(function Badge2(props, ref) {
  const styles = useStyleConfig("Badge", props);
  const { className, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(
    chakra.span,
    {
      ref,
      className: cx("chakra-badge", props.className),
      ...rest,
      __css: {
        display: "inline-block",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        ...styles
      }
    }
  );
});
Badge.displayName = "Badge";

export {
  Badge
};
//# sourceMappingURL=chunk-Z6RXEUPO.mjs.map