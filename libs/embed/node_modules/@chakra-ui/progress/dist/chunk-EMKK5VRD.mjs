'use client'
import {
  rotate
} from "./chunk-TXZFUZNG.mjs";

// src/shape.tsx
import { chakra } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Shape = (props) => {
  const { size, isIndeterminate, ...rest } = props;
  return /* @__PURE__ */ jsx(
    chakra.svg,
    {
      viewBox: "0 0 100 100",
      __css: {
        width: size,
        height: size,
        animation: isIndeterminate ? `${rotate} 2s linear infinite` : void 0
      },
      ...rest
    }
  );
};
Shape.displayName = "Shape";

export {
  Shape
};
//# sourceMappingURL=chunk-EMKK5VRD.mjs.map