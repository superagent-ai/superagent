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

// src/stack/index.ts
var stack_exports = {};
__export(stack_exports, {
  HStack: () => HStack,
  Stack: () => Stack,
  StackDivider: () => StackDivider,
  StackItem: () => StackItem,
  VStack: () => VStack,
  getDividerStyles: () => getDividerStyles
});
module.exports = __toCommonJS(stack_exports);

// src/stack/h-stack.tsx
var import_system3 = require("@chakra-ui/system");

// src/stack/stack.tsx
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");
var import_react = require("react");

// src/stack/stack-item.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var StackItem = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  import_system.chakra.div,
  {
    className: "chakra-stack__item",
    ...props,
    __css: {
      display: "inline-block",
      flex: "0 0 auto",
      minWidth: 0,
      ...props["__css"]
    }
  }
);
StackItem.displayName = "StackItem";

// src/stack/stack.utils.tsx
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
function getDividerStyles(options) {
  const { spacing, direction } = options;
  const dividerStyles = {
    column: {
      my: spacing,
      mx: 0,
      borderLeftWidth: 0,
      borderBottomWidth: "1px"
    },
    "column-reverse": {
      my: spacing,
      mx: 0,
      borderLeftWidth: 0,
      borderBottomWidth: "1px"
    },
    row: {
      mx: spacing,
      my: 0,
      borderLeftWidth: "1px",
      borderBottomWidth: 0
    },
    "row-reverse": {
      mx: spacing,
      my: 0,
      borderLeftWidth: "1px",
      borderBottomWidth: 0
    }
  };
  return {
    "&": (0, import_breakpoint_utils.mapResponsive)(
      direction,
      (value) => dividerStyles[value]
    )
  };
}

// src/stack/stack.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Stack = (0, import_system2.forwardRef)((props, ref) => {
  const {
    isInline,
    direction: directionProp,
    align,
    justify,
    spacing = "0.5rem",
    wrap,
    children,
    divider,
    className,
    shouldWrapChildren,
    ...rest
  } = props;
  const direction = isInline ? "row" : directionProp != null ? directionProp : "column";
  const dividerStyle = (0, import_react.useMemo)(
    () => getDividerStyles({ spacing, direction }),
    [spacing, direction]
  );
  const hasDivider = !!divider;
  const shouldUseChildren = !shouldWrapChildren && !hasDivider;
  const clones = (0, import_react.useMemo)(() => {
    const validChildren = (0, import_react_children_utils.getValidChildren)(children);
    return shouldUseChildren ? validChildren : validChildren.map((child, index) => {
      const key = typeof child.key !== "undefined" ? child.key : index;
      const isLast = index + 1 === validChildren.length;
      const wrappedChild = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StackItem, { children: child }, key);
      const _child = shouldWrapChildren ? wrappedChild : child;
      if (!hasDivider)
        return _child;
      const clonedDivider = (0, import_react.cloneElement)(
        divider,
        {
          __css: dividerStyle
        }
      );
      const _divider = isLast ? null : clonedDivider;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react.Fragment, { children: [
        _child,
        _divider
      ] }, key);
    });
  }, [
    divider,
    dividerStyle,
    hasDivider,
    shouldUseChildren,
    shouldWrapChildren,
    children
  ]);
  const _className = (0, import_shared_utils.cx)("chakra-stack", className);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.div,
    {
      ref,
      display: "flex",
      alignItems: align,
      justifyContent: justify,
      flexDirection: direction,
      flexWrap: wrap,
      gap: hasDivider ? void 0 : spacing,
      className: _className,
      ...rest,
      children: clones
    }
  );
});
Stack.displayName = "Stack";

// src/stack/h-stack.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var HStack = (0, import_system3.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Stack, { align: "center", ...props, direction: "row", ref }));
HStack.displayName = "HStack";

// src/stack/stack-divider.tsx
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
var StackDivider = (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
  import_system4.chakra.div,
  {
    className: "chakra-stack__divider",
    ...props,
    __css: {
      ...props["__css"],
      borderWidth: 0,
      alignSelf: "stretch",
      borderColor: "inherit",
      width: "auto",
      height: "auto"
    }
  }
);
StackDivider.displayName = "StackDivider";

// src/stack/v-stack.tsx
var import_system5 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var VStack = (0, import_system5.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Stack, { align: "center", ...props, direction: "column", ref }));
VStack.displayName = "VStack";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HStack,
  Stack,
  StackDivider,
  StackItem,
  VStack,
  getDividerStyles
});
//# sourceMappingURL=index.js.map