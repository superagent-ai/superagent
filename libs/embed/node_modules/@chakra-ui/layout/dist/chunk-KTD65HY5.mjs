'use client'

// src/stack/stack-divider.tsx
import { chakra } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StackDivider = (props) => /* @__PURE__ */ jsx(
  chakra.div,
  {
    className: "chakra-stack__divider",
    ...props,
    __css: {
      ...props["__css"],
      borderWidth: 0,
      alignSelf: "stretch",
      borderColor: "inherit",
      width: "auto",
      height: "auto"
    }
  }
);
StackDivider.displayName = "StackDivider";

export {
  StackDivider
};
//# sourceMappingURL=chunk-KTD65HY5.mjs.map