'use client'

// src/link-box.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var LinkOverlay = forwardRef(
  function LinkOverlay2(props, ref) {
    const { isExternal, target, rel, className, ...rest } = props;
    return /* @__PURE__ */ jsx(
      chakra.a,
      {
        ...rest,
        ref,
        className: cx("chakra-linkbox__overlay", className),
        rel: isExternal ? "noopener noreferrer" : rel,
        target: isExternal ? "_blank" : target,
        __css: {
          position: "static",
          "&::before": {
            content: "''",
            cursor: "inherit",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%"
          }
        }
      }
    );
  }
);
var LinkBox = forwardRef(function LinkBox2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      position: "relative",
      ...rest,
      className: cx("chakra-linkbox", className),
      __css: {
        /* Elevate the links and abbreviations up */
        "a[href]:not(.chakra-linkbox__overlay), abbr[title]": {
          position: "relative",
          zIndex: 1
        }
      }
    }
  );
});

export {
  LinkOverlay,
  LinkBox
};
//# sourceMappingURL=chunk-NRJBSIIZ.mjs.map