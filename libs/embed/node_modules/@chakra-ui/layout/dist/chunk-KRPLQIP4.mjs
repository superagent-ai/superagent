'use client'

// src/flex.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Flex = forwardRef(function Flex2(props, ref) {
  const { direction, align, justify, wrap, basis, grow, shrink, ...rest } = props;
  const styles = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink
  };
  return /* @__PURE__ */ jsx(chakra.div, { ref, __css: styles, ...rest });
});
Flex.displayName = "Flex";

export {
  Flex
};
//# sourceMappingURL=chunk-KRPLQIP4.mjs.map