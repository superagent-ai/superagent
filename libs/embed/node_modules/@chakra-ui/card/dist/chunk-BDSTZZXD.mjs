'use client'
import {
  useCardStyles
} from "./chunk-HAZMUPV3.mjs";

// src/card-footer.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  forwardRef,
  chakra
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var CardFooter = forwardRef(
  function CardFooter2(props, ref) {
    const { className, justify, ...rest } = props;
    const styles = useCardStyles();
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        className: cx("chakra-card__footer", className),
        __css: {
          display: "flex",
          justifyContent: justify,
          ...styles.footer
        },
        ...rest
      }
    );
  }
);

export {
  CardFooter
};
//# sourceMappingURL=chunk-BDSTZZXD.mjs.map