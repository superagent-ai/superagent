'use client'

// src/box.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Box = chakra("div");
Box.displayName = "Box";
var Square = forwardRef(function Square2(props, ref) {
  const { size, centerContent = true, ...rest } = props;
  const styles = centerContent ? { display: "flex", alignItems: "center", justifyContent: "center" } : {};
  return /* @__PURE__ */ jsx(
    Box,
    {
      ref,
      boxSize: size,
      __css: {
        ...styles,
        flexShrink: 0,
        flexGrow: 0
      },
      ...rest
    }
  );
});
Square.displayName = "Square";
var Circle = forwardRef(function Circle2(props, ref) {
  const { size, ...rest } = props;
  return /* @__PURE__ */ jsx(Square, { size, ref, borderRadius: "9999px", ...rest });
});
Circle.displayName = "Circle";

export {
  Box,
  Square,
  Circle
};
//# sourceMappingURL=chunk-PULVB27S.mjs.map