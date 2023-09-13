'use client'

// src/skip-nav.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var fallbackId = "chakra-skip-nav";
function getStyles(styles) {
  return {
    userSelect: "none",
    border: "0",
    height: "1px",
    width: "1px",
    margin: "-1px",
    padding: "0",
    outline: "0",
    overflow: "hidden",
    position: "absolute",
    clip: "rect(0 0 0 0)",
    ...styles,
    _focus: {
      clip: "auto",
      width: "auto",
      height: "auto",
      ...styles["_focus"]
    }
  };
}
var SkipNavLink = forwardRef(
  function SkipNavLink2(props, ref) {
    const styles = useStyleConfig("SkipLink", props);
    const { id = fallbackId, ...rest } = omitThemingProps(props);
    return /* @__PURE__ */ jsx(chakra.a, { ...rest, ref, href: `#${id}`, __css: getStyles(styles) });
  }
);
SkipNavLink.displayName = "SkipNavLink";
var SkipNavContent = forwardRef(
  function SkipNavContent2(props, ref) {
    const { id = fallbackId, ...rest } = props;
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        id,
        tabIndex: -1,
        style: { outline: 0 },
        ...rest
      }
    );
  }
);
SkipNavContent.displayName = "SkipNavContent";

export {
  SkipNavLink,
  SkipNavContent
};
//# sourceMappingURL=chunk-IZODFAGU.mjs.map