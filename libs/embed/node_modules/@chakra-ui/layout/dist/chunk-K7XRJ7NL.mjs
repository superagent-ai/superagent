'use client'

// src/link.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var Link = forwardRef(function Link2(props, ref) {
  const styles = useStyleConfig("Link", props);
  const { className, isExternal, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(
    chakra.a,
    {
      target: isExternal ? "_blank" : void 0,
      rel: isExternal ? "noopener" : void 0,
      ref,
      className: cx("chakra-link", className),
      ...rest,
      __css: styles
    }
  );
});
Link.displayName = "Link";

export {
  Link
};
//# sourceMappingURL=chunk-K7XRJ7NL.mjs.map