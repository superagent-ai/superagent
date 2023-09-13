'use client'
import {
  usePopoverContext,
  usePopoverStyles
} from "./chunk-Z3POGKNI.mjs";

// src/popover-body.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var PopoverBody = forwardRef(
  function PopoverBody2(props, ref) {
    const { getBodyProps } = usePopoverContext();
    const styles = usePopoverStyles();
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...getBodyProps(props, ref),
        className: cx("chakra-popover__body", props.className),
        __css: styles.body
      }
    );
  }
);
PopoverBody.displayName = "PopoverBody";

export {
  PopoverBody
};
//# sourceMappingURL=chunk-RLMGYZLY.mjs.map