'use client'

// src/button-spinner.tsx
import { Spinner } from "@chakra-ui/spinner";
import { chakra } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
function ButtonSpinner(props) {
  const {
    label,
    placement,
    spacing = "0.5rem",
    children = /* @__PURE__ */ jsx(Spinner, { color: "currentColor", width: "1em", height: "1em" }),
    className,
    __css,
    ...rest
  } = props;
  const _className = cx("chakra-button__spinner", className);
  const marginProp = placement === "start" ? "marginEnd" : "marginStart";
  const spinnerStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      position: label ? "relative" : "absolute",
      [marginProp]: label ? spacing : 0,
      fontSize: "1em",
      lineHeight: "normal",
      ...__css
    }),
    [__css, label, marginProp, spacing]
  );
  return /* @__PURE__ */ jsx(chakra.div, { className: _className, ...rest, __css: spinnerStyles, children });
}
ButtonSpinner.displayName = "ButtonSpinner";

export {
  ButtonSpinner
};
//# sourceMappingURL=chunk-QB2Y5VKH.mjs.map