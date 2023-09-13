'use client'

// src/button-icon.tsx
import { chakra } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { cloneElement, isValidElement } from "react";
import { jsx } from "react/jsx-runtime";
function ButtonIcon(props) {
  const { children, className, ...rest } = props;
  const _children = isValidElement(children) ? cloneElement(children, {
    "aria-hidden": true,
    focusable: false
  }) : children;
  const _className = cx("chakra-button__icon", className);
  return /* @__PURE__ */ jsx(
    chakra.span,
    {
      display: "inline-flex",
      alignSelf: "center",
      flexShrink: 0,
      ...rest,
      className: _className,
      children: _children
    }
  );
}
ButtonIcon.displayName = "ButtonIcon";

export {
  ButtonIcon
};
//# sourceMappingURL=chunk-3RENZ2UO.mjs.map