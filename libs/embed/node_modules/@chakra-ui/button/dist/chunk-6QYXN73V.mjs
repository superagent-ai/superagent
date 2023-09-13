'use client'
import {
  Button
} from "./chunk-UVUR7MCU.mjs";

// src/icon-button.tsx
import { forwardRef } from "@chakra-ui/system";
import { cloneElement, isValidElement } from "react";
import { jsx } from "react/jsx-runtime";
var IconButton = forwardRef(
  (props, ref) => {
    const { icon, children, isRound, "aria-label": ariaLabel, ...rest } = props;
    const element = icon || children;
    const _children = isValidElement(element) ? cloneElement(element, {
      "aria-hidden": true,
      focusable: false
    }) : null;
    return /* @__PURE__ */ jsx(
      Button,
      {
        padding: "0",
        borderRadius: isRound ? "full" : void 0,
        ref,
        "aria-label": ariaLabel,
        ...rest,
        children: _children
      }
    );
  }
);
IconButton.displayName = "IconButton";

export {
  IconButton
};
//# sourceMappingURL=chunk-6QYXN73V.mjs.map