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

// src/avatar-badge.tsx
var avatar_badge_exports = {};
__export(avatar_badge_exports, {
  AvatarBadge: () => AvatarBadge
});
module.exports = __toCommonJS(avatar_badge_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/avatar-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var [AvatarStylesProvider, useAvatarStyles] = (0, import_react_context.createContext)({
  name: `AvatarStylesContext`,
  hookName: `useAvatarStyles`,
  providerName: "<Avatar/>"
});

// src/avatar-badge.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var placementMap = {
  "top-start": {
    top: "0",
    insetStart: "0",
    transform: "translate(-25%, -25%)"
  },
  "top-end": {
    top: "0",
    insetEnd: "0",
    transform: "translate(25%, -25%)"
  },
  "bottom-start": {
    bottom: "0",
    insetStart: "0",
    transform: "translate(-25%, 25%)"
  },
  "bottom-end": {
    bottom: "0",
    insetEnd: "0",
    transform: "translate(25%, 25%)"
  }
};
var AvatarBadge = (0, import_system.forwardRef)(
  function AvatarBadge2(props, ref) {
    const { placement = "bottom-end", className, ...rest } = props;
    const styles = useAvatarStyles();
    const placementStyles = placementMap[placement];
    const badgeStyles = {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...placementStyles,
      ...styles.badge
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        ...rest,
        className: (0, import_shared_utils.cx)("chakra-avatar__badge", className),
        __css: badgeStyles
      }
    );
  }
);
AvatarBadge.displayName = "AvatarBadge";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvatarBadge
});
//# sourceMappingURL=avatar-badge.js.map