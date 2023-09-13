'use client'

// src/stack/stack-item.tsx
import { chakra } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StackItem = (props) => /* @__PURE__ */ jsx(
  chakra.div,
  {
    className: "chakra-stack__item",
    ...props,
    __css: {
      display: "inline-block",
      flex: "0 0 auto",
      minWidth: 0,
      ...props["__css"]
    }
  }
);
StackItem.displayName = "StackItem";

export {
  StackItem
};
//# sourceMappingURL=chunk-ZFQCCYWD.mjs.map