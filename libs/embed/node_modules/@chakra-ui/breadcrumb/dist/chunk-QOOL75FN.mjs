'use client'
import {
  BreadcrumbStylesProvider
} from "./chunk-24NX3CUR.mjs";

// src/breadcrumb.tsx
import { cx } from "@chakra-ui/shared-utils";
import { getValidChildren } from "@chakra-ui/react-children-utils";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cloneElement } from "react";
import { jsx } from "react/jsx-runtime";
var Breadcrumb = forwardRef(
  function Breadcrumb2(props, ref) {
    const styles = useMultiStyleConfig("Breadcrumb", props);
    const ownProps = omitThemingProps(props);
    const {
      children,
      spacing = "0.5rem",
      separator = "/",
      className,
      listProps,
      ...rest
    } = ownProps;
    const validChildren = getValidChildren(children);
    const count = validChildren.length;
    const clones = validChildren.map(
      (child, index) => cloneElement(child, {
        separator,
        spacing,
        isLastChild: count === index + 1
      })
    );
    const _className = cx("chakra-breadcrumb", className);
    return /* @__PURE__ */ jsx(
      chakra.nav,
      {
        ref,
        "aria-label": "breadcrumb",
        className: _className,
        __css: styles.container,
        ...rest,
        children: /* @__PURE__ */ jsx(BreadcrumbStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
          chakra.ol,
          {
            className: "chakra-breadcrumb__list",
            ...listProps,
            __css: {
              display: "flex",
              alignItems: "center",
              ...styles.list
            },
            children: clones
          }
        ) })
      }
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export {
  Breadcrumb
};
//# sourceMappingURL=chunk-QOOL75FN.mjs.map