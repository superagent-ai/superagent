'use client'

// src/wrap.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { Children, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var Wrap = forwardRef(function Wrap2(props, ref) {
  const {
    spacing = "0.5rem",
    spacingX,
    spacingY,
    children,
    justify,
    direction,
    align,
    className,
    shouldWrapChildren,
    ...rest
  } = props;
  const _children = useMemo(
    () => shouldWrapChildren ? Children.map(children, (child, index) => /* @__PURE__ */ jsx(WrapItem, { children: child }, index)) : children,
    [children, shouldWrapChildren]
  );
  return /* @__PURE__ */ jsx(chakra.div, { ref, className: cx("chakra-wrap", className), ...rest, children: /* @__PURE__ */ jsx(
    chakra.ul,
    {
      className: "chakra-wrap__list",
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        listStyleType: "none",
        gap: spacing,
        columnGap: spacingX,
        rowGap: spacingY,
        padding: "0"
      },
      children: _children
    }
  ) });
});
Wrap.displayName = "Wrap";
var WrapItem = forwardRef(function WrapItem2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsx(
    chakra.li,
    {
      ref,
      __css: { display: "flex", alignItems: "flex-start" },
      className: cx("chakra-wrap__listitem", className),
      ...rest
    }
  );
});
WrapItem.displayName = "WrapItem";

export {
  Wrap,
  WrapItem
};
//# sourceMappingURL=chunk-7ELO524Q.mjs.map