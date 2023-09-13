'use client'

// src/kbd.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Kbd = forwardRef(function Kbd2(props, ref) {
  const styles = useStyleConfig("Kbd", props);
  const { className, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(
    chakra.kbd,
    {
      ref,
      className: cx("chakra-kbd", className),
      ...rest,
      __css: {
        fontFamily: "mono",
        ...styles
      }
    }
  );
});
Kbd.displayName = "Kbd";

export {
  Kbd
};
//# sourceMappingURL=chunk-EBIU6VW7.mjs.map