'use client'

// src/text.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { compact } from "@chakra-ui/object-utils";
import { jsx } from "react/jsx-runtime";
var Text = forwardRef(function Text2(props, ref) {
  const styles = useStyleConfig("Text", props);
  const { className, align, decoration, casing, ...rest } = omitThemingProps(props);
  const aliasedProps = compact({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing
  });
  return /* @__PURE__ */ jsx(
    chakra.p,
    {
      ref,
      className: cx("chakra-text", props.className),
      ...aliasedProps,
      ...rest,
      __css: styles
    }
  );
});
Text.displayName = "Text";

export {
  Text
};
//# sourceMappingURL=chunk-2OOHT3W5.mjs.map