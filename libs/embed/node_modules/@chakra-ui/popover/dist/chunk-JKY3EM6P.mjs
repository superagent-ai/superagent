'use client'
import {
  usePopoverContext,
  usePopoverStyles
} from "./chunk-Z3POGKNI.mjs";

// src/popover-close-button.tsx
import { CloseButton } from "@chakra-ui/close-button";
import { forwardRef } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var PopoverCloseButton = forwardRef(
  function PopoverCloseButton2(props, ref) {
    const { onClose } = usePopoverContext();
    const styles = usePopoverStyles();
    return /* @__PURE__ */ jsx(
      CloseButton,
      {
        size: "sm",
        onClick: onClose,
        className: cx("chakra-popover__close-btn", props.className),
        __css: styles.closeButton,
        ref,
        ...props
      }
    );
  }
);
PopoverCloseButton.displayName = "PopoverCloseButton";

export {
  PopoverCloseButton
};
//# sourceMappingURL=chunk-JKY3EM6P.mjs.map