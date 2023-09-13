'use client'
import {
  useButtonType
} from "./chunk-J37R6SZE.mjs";
import {
  useButtonGroup
} from "./chunk-T6ZDZOLO.mjs";
import {
  ButtonIcon
} from "./chunk-3RENZ2UO.mjs";
import {
  ButtonSpinner
} from "./chunk-QB2Y5VKH.mjs";

// src/button.tsx
import { useMergeRefs } from "@chakra-ui/react-use-merge-refs";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { cx, dataAttr } from "@chakra-ui/shared-utils";
import { useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Button = forwardRef((props, ref) => {
  const group = useButtonGroup();
  const styles = useStyleConfig("Button", { ...group, ...props });
  const {
    isDisabled = group == null ? void 0 : group.isDisabled,
    isLoading,
    isActive,
    children,
    leftIcon,
    rightIcon,
    loadingText,
    iconSpacing = "0.5rem",
    type,
    spinner,
    spinnerPlacement = "start",
    className,
    as,
    ...rest
  } = omitThemingProps(props);
  const buttonStyles = useMemo(() => {
    const _focus = { ...styles == null ? void 0 : styles["_focus"], zIndex: 1 };
    return {
      display: "inline-flex",
      appearance: "none",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      position: "relative",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      outline: "none",
      ...styles,
      ...!!group && { _focus }
    };
  }, [styles, group]);
  const { ref: _ref, type: defaultType } = useButtonType(as);
  const contentProps = { rightIcon, leftIcon, iconSpacing, children };
  return /* @__PURE__ */ jsxs(
    chakra.button,
    {
      ref: useMergeRefs(ref, _ref),
      as,
      type: type != null ? type : defaultType,
      "data-active": dataAttr(isActive),
      "data-loading": dataAttr(isLoading),
      __css: buttonStyles,
      className: cx("chakra-button", className),
      ...rest,
      disabled: isDisabled || isLoading,
      children: [
        isLoading && spinnerPlacement === "start" && /* @__PURE__ */ jsx(
          ButtonSpinner,
          {
            className: "chakra-button__spinner--start",
            label: loadingText,
            placement: "start",
            spacing: iconSpacing,
            children: spinner
          }
        ),
        isLoading ? loadingText || /* @__PURE__ */ jsx(chakra.span, { opacity: 0, children: /* @__PURE__ */ jsx(ButtonContent, { ...contentProps }) }) : /* @__PURE__ */ jsx(ButtonContent, { ...contentProps }),
        isLoading && spinnerPlacement === "end" && /* @__PURE__ */ jsx(
          ButtonSpinner,
          {
            className: "chakra-button__spinner--end",
            label: loadingText,
            placement: "end",
            spacing: iconSpacing,
            children: spinner
          }
        )
      ]
    }
  );
});
Button.displayName = "Button";
function ButtonContent(props) {
  const { leftIcon, rightIcon, children, iconSpacing } = props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    leftIcon && /* @__PURE__ */ jsx(ButtonIcon, { marginEnd: iconSpacing, children: leftIcon }),
    children,
    rightIcon && /* @__PURE__ */ jsx(ButtonIcon, { marginStart: iconSpacing, children: rightIcon })
  ] });
}

export {
  Button
};
//# sourceMappingURL=chunk-UVUR7MCU.mjs.map