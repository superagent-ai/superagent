'use client'
import {
  baseStyle
} from "./chunk-V7PAE35Z.mjs";

// src/avatar-group.tsx
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { getValidChildren } from "@chakra-ui/react-children-utils";

// ../../utilities/object-utils/src/compact.ts
function compact(object) {
  const clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === void 0)
      delete clone[key];
  }
  return clone;
}

// src/avatar-group.tsx
import { cloneElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AvatarGroup = forwardRef(
  function AvatarGroup2(props, ref) {
    const styles = useMultiStyleConfig("Avatar", props);
    const {
      children,
      borderColor,
      max,
      spacing = "-0.75rem",
      borderRadius = "full",
      ...rest
    } = omitThemingProps(props);
    const validChildren = getValidChildren(children);
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
      return cloneElement(child, compact(childProps));
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
    return /* @__PURE__ */ jsxs(
      chakra.div,
      {
        ref,
        role: "group",
        __css: groupStyles,
        ...rest,
        className: cx("chakra-avatar__group", props.className),
        children: [
          excess > 0 && /* @__PURE__ */ jsx(chakra.span, { className: "chakra-avatar__excess", __css: excessStyles, children: `+${excess}` }),
          clones
        ]
      }
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export {
  AvatarGroup
};
//# sourceMappingURL=chunk-A4TTV745.mjs.map