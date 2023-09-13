'use client'
import {
  BreadcrumbLink
} from "./chunk-UIZJRKRT.mjs";
import {
  BreadcrumbSeparator
} from "./chunk-I4SEDIQD.mjs";
import {
  useBreadcrumbStyles
} from "./chunk-24NX3CUR.mjs";

// src/breadcrumb-item.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { getValidChildren } from "@chakra-ui/react-children-utils";
import { cx } from "@chakra-ui/shared-utils";
import { cloneElement } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var BreadcrumbItem = forwardRef(
  function BreadcrumbItem2(props, ref) {
    const {
      isCurrentPage,
      separator,
      isLastChild,
      spacing,
      children,
      className,
      ...rest
    } = props;
    const validChildren = getValidChildren(children);
    const clones = validChildren.map((child) => {
      if (child.type === BreadcrumbLink) {
        return cloneElement(child, {
          isCurrentPage
        });
      }
      if (child.type === BreadcrumbSeparator) {
        return cloneElement(child, {
          spacing,
          children: child.props.children || separator
        });
      }
      return child;
    });
    const styles = useBreadcrumbStyles();
    const itemStyles = {
      display: "inline-flex",
      alignItems: "center",
      ...styles.item
    };
    const _className = cx("chakra-breadcrumb__list-item", className);
    return /* @__PURE__ */ jsxs(chakra.li, { ref, className: _className, ...rest, __css: itemStyles, children: [
      clones,
      !isLastChild && /* @__PURE__ */ jsx(BreadcrumbSeparator, { spacing, children: separator })
    ] });
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export {
  BreadcrumbItem
};
//# sourceMappingURL=chunk-U7EUQI2I.mjs.map