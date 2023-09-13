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

// src/avatar-group.tsx
var avatar_group_exports = {};
__export(avatar_group_exports, {
  AvatarGroup: () => AvatarGroup
});
module.exports = __toCommonJS(avatar_group_exports);
var import_system5 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react_children_utils = require("@chakra-ui/react-children-utils");

// ../../utilities/object-utils/src/compact.ts
function compact(object) {
  const clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === void 0)
      delete clone[key];
  }
  return clone;
}

// src/avatar.tsx
var import_system4 = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/avatar-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var [AvatarStylesProvider, useAvatarStyles] = (0, import_react_context.createContext)({
  name: `AvatarStylesContext`,
  hookName: `useAvatarStyles`,
  providerName: "<Avatar/>"
});

// src/avatar-image.tsx
var import_image = require("@chakra-ui/image");
var import_system3 = require("@chakra-ui/system");
var import_react = require("react");

// src/avatar-name.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
function initials(name) {
  var _a;
  const names = name.split(" ");
  const firstName = (_a = names[0]) != null ? _a : "";
  const lastName = names.length > 1 ? names[names.length - 1] : "";
  return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0);
}
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

// src/avatar.tsx
var import_react2 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
var Avatar = (0, import_system4.forwardRef)((props, ref) => {
  const styles = (0, import_system4.useMultiStyleConfig)("Avatar", props);
  const [isLoaded, setIsLoaded] = (0, import_react2.useState)(false);
  const {
    src,
    srcSet,
    name,
    showBorder,
    borderRadius = "full",
    onError,
    onLoad: onLoadProp,
    getInitials = initials,
    icon = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GenericAvatarIcon, {}),
    iconLabel = " avatar",
    loading,
    children,
    borderColor,
    ignoreFallback,
    crossOrigin,
    referrerPolicy,
    ...rest
  } = (0, import_system4.omitThemingProps)(props);
  const avatarStyles = {
    borderRadius,
    borderWidth: showBorder ? "2px" : void 0,
    ...baseStyle,
    ...styles.container
  };
  if (borderColor) {
    avatarStyles.borderColor = borderColor;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_system4.chakra.span,
    {
      ref,
      ...rest,
      className: (0, import_shared_utils.cx)("chakra-avatar", props.className),
      "data-loaded": (0, import_shared_utils.dataAttr)(isLoaded),
      __css: avatarStyles,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AvatarStylesProvider, { value: styles, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          AvatarImage,
          {
            src,
            srcSet,
            loading,
            onLoad: (0, import_shared_utils.callAllHandlers)(onLoadProp, () => {
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

// src/avatar-group.tsx
var import_react3 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var AvatarGroup = (0, import_system5.forwardRef)(
  function AvatarGroup2(props, ref) {
    const styles = (0, import_system5.useMultiStyleConfig)("Avatar", props);
    const {
      children,
      borderColor,
      max,
      spacing = "-0.75rem",
      borderRadius = "full",
      ...rest
    } = (0, import_system5.omitThemingProps)(props);
    const validChildren = (0, import_react_children_utils.getValidChildren)(children);
    const childrenWithinMax = max != null ? validChildren.slice(0, max) : validChildren;
    const excess = max != null ? validChildren.length - max : 0;
    const reversedChildren = childrenWithinMax.reverse();
    const clones = reversedChildren.map((child, index) => {
      var _a;
      const isFirstAvatar = index === 0;
      const childProps = {
        marginEnd: isFirstAvatar ? 0 : spacing,
        size: props.size,
        borderColor: (_a = child.props.borderColor) != null ? _a : borderColor,
        showBorder: true
      };
      return (0, import_react3.cloneElement)(child, compact(childProps));
    });
    const groupStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexDirection: "row-reverse",
      ...styles.group
    };
    const excessStyles = {
      borderRadius,
      marginStart: spacing,
      ...baseStyle,
      ...styles.excessLabel
    };
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      import_system5.chakra.div,
      {
        ref,
        role: "group",
        __css: groupStyles,
        ...rest,
        className: (0, import_shared_utils2.cx)("chakra-avatar__group", props.className),
        children: [
          excess > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_system5.chakra.span, { className: "chakra-avatar__excess", __css: excessStyles, children: `+${excess}` }),
          clones
        ]
      }
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvatarGroup
});
//# sourceMappingURL=avatar-group.js.map