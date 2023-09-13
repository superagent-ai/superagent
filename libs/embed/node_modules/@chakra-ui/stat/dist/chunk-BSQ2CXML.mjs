'use client'

// src/stat-group.tsx
import { cx } from "@chakra-ui/shared-utils";
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var StatGroup = forwardRef(function StatGroup2(props, ref) {
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ...props,
      ref,
      role: "group",
      className: cx("chakra-stat__group", props.className),
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start"
      }
    }
  );
});
StatGroup.displayName = "StatGroup";

export {
  StatGroup
};
//# sourceMappingURL=chunk-BSQ2CXML.mjs.map