'use client'
import {
  AvatarName
} from "./chunk-O25PJXSD.mjs";
import {
  GenericAvatarIcon
} from "./chunk-CXYPMOCL.mjs";

// src/avatar-image.tsx
import { useImage } from "@chakra-ui/image";
import { chakra } from "@chakra-ui/system";
import { cloneElement } from "react";
import { jsx } from "react/jsx-runtime";
function AvatarImage(props) {
  const {
    src,
    srcSet,
    onError,
    onLoad,
    getInitials,
    name,
    borderRadius,
    loading,
    iconLabel,
    icon = /* @__PURE__ */ jsx(GenericAvatarIcon, {}),
    ignoreFallback,
    referrerPolicy,
    crossOrigin
  } = props;
  const status = useImage({ src, onError, crossOrigin, ignoreFallback });
  const hasLoaded = status === "loaded";
  const showFallback = !src || !hasLoaded;
  if (showFallback) {
    return name ? /* @__PURE__ */ jsx(
      AvatarName,
      {
        className: "chakra-avatar__initials",
        getInitials,
        name
      }
    ) : cloneElement(icon, {
      role: "img",
      "aria-label": iconLabel
    });
  }
  return /* @__PURE__ */ jsx(
    chakra.img,
    {
      src,
      srcSet,
      alt: name,
      onLoad,
      referrerPolicy,
      crossOrigin: crossOrigin != null ? crossOrigin : void 0,
      className: "chakra-avatar__img",
      loading,
      __css: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius
      }
    }
  );
}
AvatarImage.displayName = "AvatarImage";

export {
  AvatarImage
};
//# sourceMappingURL=chunk-V2ATFO44.mjs.map