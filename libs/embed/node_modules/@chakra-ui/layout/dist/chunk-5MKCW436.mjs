'use client'

// src/container.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Container = forwardRef(function Container2(props, ref) {
  const { className, centerContent, ...rest } = omitThemingProps(props);
  const styles = useStyleConfig("Container", props);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      className: cx("chakra-container", className),
      ...rest,
      __css: {
        ...styles,
        ...centerContent && {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }
      }
    }
  );
});
Container.displayName = "Container";

export {
  Container
};
//# sourceMappingURL=chunk-5MKCW436.mjs.map