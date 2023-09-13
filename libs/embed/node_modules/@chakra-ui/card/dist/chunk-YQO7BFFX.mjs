'use client'
import {
  CardStylesProvider
} from "./chunk-HAZMUPV3.mjs";

// src/card.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  forwardRef,
  chakra,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Card = forwardRef(function Card2(props, ref) {
  const {
    className,
    children,
    direction = "column",
    justify,
    align,
    ...rest
  } = omitThemingProps(props);
  const styles = useMultiStyleConfig("Card", props);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      className: cx("chakra-card", className),
      __css: {
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        position: "relative",
        minWidth: 0,
        wordWrap: "break-word",
        ...styles.container
      },
      ...rest,
      children: /* @__PURE__ */ jsx(CardStylesProvider, { value: styles, children })
    }
  );
});

export {
  Card
};
//# sourceMappingURL=chunk-YQO7BFFX.mjs.map