'use client'
import {
  AvatarImage
} from "./chunk-V2ATFO44.mjs";
import {
  initials
} from "./chunk-O25PJXSD.mjs";
import {
  AvatarStylesProvider
} from "./chunk-RD3LQCU3.mjs";
import {
  GenericAvatarIcon
} from "./chunk-CXYPMOCL.mjs";

// src/avatar.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { callAllHandlers, cx, dataAttr } from "@chakra-ui/shared-utils";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  textTransform: "uppercase",
  fontWeight: "medium",
  position: "relative",
  flexShrink: 0
};
var Avatar = forwardRef((props, ref) => {
  const styles = useMultiStyleConfig("Avatar", props);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    src,
    srcSet,
    name,
    showBorder,
    borderRadius = "full",
    onError,
    onLoad: onLoadProp,
    getInitials = initials,
    icon = /* @__PURE__ */ jsx(GenericAvatarIcon, {}),
    iconLabel = " avatar",
    loading,
    children,
    borderColor,
    ignoreFallback,
    crossOrigin,
    referrerPolicy,
    ...rest
  } = omitThemingProps(props);
  const avatarStyles = {
    borderRadius,
    borderWidth: showBorder ? "2px" : void 0,
    ...baseStyle,
    ...styles.container
  };
  if (borderColor) {
    avatarStyles.borderColor = borderColor;
  }
  return /* @__PURE__ */ jsx(
    chakra.span,
    {
      ref,
      ...rest,
      className: cx("chakra-avatar", props.className),
      "data-loaded": dataAttr(isLoaded),
      __css: avatarStyles,
      children: /* @__PURE__ */ jsxs(AvatarStylesProvider, { value: styles, children: [
        /* @__PURE__ */ jsx(
          AvatarImage,
          {
            src,
            srcSet,
            loading,
            onLoad: callAllHandlers(onLoadProp, () => {
              setIsLoaded(true);
            }),
            onError,
            getInitials,
            name,
            borderRadius,
            icon,
            iconLabel,
            ignoreFallback,
            crossOrigin,
            referrerPolicy
          }
        ),
        children
      ] })
    }
  );
});
Avatar.displayName = "Avatar";

export {
  baseStyle,
  Avatar
};
//# sourceMappingURL=chunk-V7PAE35Z.mjs.map