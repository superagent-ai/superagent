'use client'

// src/native-image.tsx
import { forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var NativeImage = forwardRef(function NativeImage2(props, ref) {
  const { htmlWidth, htmlHeight, alt, ...rest } = props;
  return /* @__PURE__ */ jsx("img", { width: htmlWidth, height: htmlHeight, ref, alt, ...rest });
});
NativeImage.displayName = "NativeImage";

export {
  NativeImage
};
//# sourceMappingURL=chunk-X3PS6RUF.mjs.map