'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/avatar-image.tsx
var avatar_image_exports = {};
__export(avatar_image_exports, {
  AvatarImage: () => AvatarImage
});
module.exports = __toCommonJS(avatar_image_exports);
var import_image = require("@chakra-ui/image");
var import_system3 = require("@chakra-ui/system");
var import_react = require("react");

// src/avatar-name.tsx
var import_system = require("@chakra-ui/system");

// src/avatar-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var [AvatarStylesProvider, useAvatarStyles] = (0, import_react_context.createContext)({
  name: `AvatarStylesContext`,
  hookName: `useAvatarStyles`,
  providerName: "<Avatar/>"
});

// src/avatar-name.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function AvatarName(props) {
  const { name, getInitials, ...rest } = props;
  const styles = useAvatarStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { role: "img", "aria-label": name, ...rest, __css: styles.label, children: name ? getInitials == null ? void 0 : getInitials(name) : null });
}
AvatarName.displayName = "AvatarName";

// src/generic-avatar-icon.tsx
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var GenericAvatarIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
  import_system2.chakra.svg,
  {
    viewBox: "0 0 128 128",
    color: "#fff",
    width: "100%",
    height: "100%",
    className: "chakra-avatar__svg",
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "path",
        {
          fill: "currentColor",
          d: "M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "path",
        {
          fill: "currentColor",
          d: "M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
        }
      )
    ]
  }
);

// src/avatar-image.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
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
    icon = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GenericAvatarIcon, {}),
    ignoreFallback,
    referrerPolicy,
    crossOrigin
  } = props;
  const status = (0, import_image.useImage)({ src, onError, crossOrigin, ignoreFallback });
  const hasLoaded = status === "loaded";
  const showFallback = !src || !hasLoaded;
  if (showFallback) {
    return name ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      AvatarName,
      {
        className: "chakra-avatar__initials",
        getInitials,
        name
      }
    ) : (0, import_react.cloneElement)(icon, {
      role: "img",
      "aria-label": iconLabel
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_system3.chakra.img,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvatarImage
});
//# sourceMappingURL=avatar-image.js.map