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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AbsoluteCenter: () => AbsoluteCenter,
  AspectRatio: () => AspectRatio,
  Badge: () => Badge,
  Box: () => Box,
  Center: () => Center,
  Circle: () => Circle,
  Code: () => Code,
  Container: () => Container,
  Divider: () => Divider,
  Flex: () => Flex,
  Grid: () => Grid,
  GridItem: () => GridItem,
  HStack: () => HStack,
  Heading: () => Heading,
  Highlight: () => Highlight,
  Indicator: () => Indicator,
  Kbd: () => Kbd,
  Link: () => Link,
  LinkBox: () => LinkBox,
  LinkOverlay: () => LinkOverlay,
  List: () => List,
  ListIcon: () => ListIcon,
  ListItem: () => ListItem,
  Mark: () => Mark,
  OrderedList: () => OrderedList,
  SimpleGrid: () => SimpleGrid,
  Spacer: () => Spacer,
  Square: () => Square,
  Stack: () => Stack,
  StackDivider: () => StackDivider,
  StackItem: () => StackItem,
  Text: () => Text,
  UnorderedList: () => UnorderedList,
  VStack: () => VStack,
  Wrap: () => Wrap,
  WrapItem: () => WrapItem,
  useHighlight: () => useHighlight,
  useListStyles: () => useListStyles
});
module.exports = __toCommonJS(src_exports);

// src/aspect-ratio.tsx
var import_system = require("@chakra-ui/system");
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var AspectRatio = (0, import_system.forwardRef)(function(props, ref) {
  const { ratio = 4 / 3, children, className, ...rest } = props;
  const child = import_react.Children.only(children);
  const _className = (0, import_shared_utils.cx)("chakra-aspect-ratio", className);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      position: "relative",
      className: _className,
      _before: {
        height: 0,
        content: `""`,
        display: "block",
        paddingBottom: (0, import_breakpoint_utils.mapResponsive)(ratio, (r) => `${1 / r * 100}%`)
      },
      __css: {
        "& > *:not(style)": {
          overflow: "hidden",
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        },
        "& > img, & > video": {
          objectFit: "cover"
        }
      },
      ...rest,
      children: child
    }
  );
});
AspectRatio.displayName = "AspectRatio";

// src/badge.tsx
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
var Badge = (0, import_system2.forwardRef)(function Badge2(props, ref) {
  const styles = (0, import_system2.useStyleConfig)("Badge", props);
  const { className, ...rest } = (0, import_system2.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.span,
    {
      ref,
      className: (0, import_shared_utils2.cx)("chakra-badge", props.className),
      ...rest,
      __css: {
        display: "inline-block",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        ...styles
      }
    }
  );
});
Badge.displayName = "Badge";

// src/box.tsx
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime3 = require("react/jsx-runtime");
var Box = (0, import_system3.chakra)("div");
Box.displayName = "Box";
var Square = (0, import_system3.forwardRef)(function Square2(props, ref) {
  const { size, centerContent = true, ...rest } = props;
  const styles = centerContent ? { display: "flex", alignItems: "center", justifyContent: "center" } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    Box,
    {
      ref,
      boxSize: size,
      __css: {
        ...styles,
        flexShrink: 0,
        flexGrow: 0
      },
      ...rest
    }
  );
});
Square.displayName = "Square";
var Circle = (0, import_system3.forwardRef)(function Circle2(props, ref) {
  const { size, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Square, { size, ref, borderRadius: "9999px", ...rest });
});
Circle.displayName = "Circle";

// src/center.tsx
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
var Center = (0, import_system4.chakra)("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
Center.displayName = "Center";
var centerStyles = {
  horizontal: {
    insetStart: "50%",
    transform: "translateX(-50%)"
  },
  vertical: {
    top: "50%",
    transform: "translateY(-50%)"
  },
  both: {
    insetStart: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  }
};
var AbsoluteCenter = (0, import_system4.forwardRef)(
  function AbsoluteCenter2(props, ref) {
    const { axis = "both", ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system4.chakra.div,
      {
        ref,
        __css: centerStyles[axis],
        ...rest,
        position: "absolute"
      }
    );
  }
);

// src/code.tsx
var import_system5 = require("@chakra-ui/system");
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_jsx_runtime5 = require("react/jsx-runtime");
var Code = (0, import_system5.forwardRef)(function Code2(props, ref) {
  const styles = (0, import_system5.useStyleConfig)("Code", props);
  const { className, ...rest } = (0, import_system5.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_system5.chakra.code,
    {
      ref,
      className: (0, import_shared_utils3.cx)("chakra-code", props.className),
      ...rest,
      __css: {
        display: "inline-block",
        ...styles
      }
    }
  );
});
Code.displayName = "Code";

// src/container.tsx
var import_system6 = require("@chakra-ui/system");
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_jsx_runtime6 = require("react/jsx-runtime");
var Container = (0, import_system6.forwardRef)(function Container2(props, ref) {
  const { className, centerContent, ...rest } = (0, import_system6.omitThemingProps)(props);
  const styles = (0, import_system6.useStyleConfig)("Container", props);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_system6.chakra.div,
    {
      ref,
      className: (0, import_shared_utils4.cx)("chakra-container", className),
      ...rest,
      __css: {
        ...styles,
        ...centerContent && {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }
      }
    }
  );
});
Container.displayName = "Container";

// src/divider.tsx
var import_system7 = require("@chakra-ui/system");
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
var Divider = (0, import_system7.forwardRef)(function Divider2(props, ref) {
  const {
    borderLeftWidth,
    borderBottomWidth,
    borderTopWidth,
    borderRightWidth,
    borderWidth,
    borderStyle,
    borderColor,
    ...styles
  } = (0, import_system7.useStyleConfig)("Divider", props);
  const {
    className,
    orientation = "horizontal",
    __css,
    ...rest
  } = (0, import_system7.omitThemingProps)(props);
  const dividerStyles = {
    vertical: {
      borderLeftWidth: borderLeftWidth || borderRightWidth || borderWidth || "1px",
      height: "100%"
    },
    horizontal: {
      borderBottomWidth: borderBottomWidth || borderTopWidth || borderWidth || "1px",
      width: "100%"
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_system7.chakra.hr,
    {
      ref,
      "aria-orientation": orientation,
      ...rest,
      __css: {
        ...styles,
        border: "0",
        borderColor,
        borderStyle,
        ...dividerStyles[orientation],
        ...__css
      },
      className: (0, import_shared_utils5.cx)("chakra-divider", className)
    }
  );
});
Divider.displayName = "Divider";

// src/flex.tsx
var import_system8 = require("@chakra-ui/system");
var import_jsx_runtime8 = require("react/jsx-runtime");
var Flex = (0, import_system8.forwardRef)(function Flex2(props, ref) {
  const { direction, align, justify, wrap, basis, grow, shrink, ...rest } = props;
  const styles = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_system8.chakra.div, { ref, __css: styles, ...rest });
});
Flex.displayName = "Flex";

// src/grid.tsx
var import_system9 = require("@chakra-ui/system");
var import_jsx_runtime9 = require("react/jsx-runtime");
var Grid = (0, import_system9.forwardRef)(function Grid2(props, ref) {
  const {
    templateAreas,
    gap,
    rowGap,
    columnGap,
    column,
    row,
    autoFlow,
    autoRows,
    templateRows,
    autoColumns,
    templateColumns,
    ...rest
  } = props;
  const styles = {
    display: "grid",
    gridTemplateAreas: templateAreas,
    gridGap: gap,
    gridRowGap: rowGap,
    gridColumnGap: columnGap,
    gridAutoColumns: autoColumns,
    gridColumn: column,
    gridRow: row,
    gridAutoFlow: autoFlow,
    gridAutoRows: autoRows,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_system9.chakra.div, { ref, __css: styles, ...rest });
});
Grid.displayName = "Grid";

// src/grid-item.tsx
var import_system10 = require("@chakra-ui/system");
var import_object_utils = require("@chakra-ui/object-utils");
var import_breakpoint_utils2 = require("@chakra-ui/breakpoint-utils");
var import_jsx_runtime10 = require("react/jsx-runtime");
function spanFn(span) {
  return (0, import_breakpoint_utils2.mapResponsive)(
    span,
    (value) => value === "auto" ? "auto" : `span ${value}/span ${value}`
  );
}
var GridItem = (0, import_system10.forwardRef)(function GridItem2(props, ref) {
  const {
    area,
    colSpan,
    colStart,
    colEnd,
    rowEnd,
    rowSpan,
    rowStart,
    ...rest
  } = props;
  const styles = (0, import_object_utils.compact)({
    gridArea: area,
    gridColumn: spanFn(colSpan),
    gridRow: spanFn(rowSpan),
    gridColumnStart: colStart,
    gridColumnEnd: colEnd,
    gridRowStart: rowStart,
    gridRowEnd: rowEnd
  });
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_system10.chakra.div, { ref, __css: styles, ...rest });
});
GridItem.displayName = "GridItem";

// src/heading.tsx
var import_system11 = require("@chakra-ui/system");
var import_shared_utils6 = require("@chakra-ui/shared-utils");
var import_jsx_runtime11 = require("react/jsx-runtime");
var Heading = (0, import_system11.forwardRef)(function Heading2(props, ref) {
  const styles = (0, import_system11.useStyleConfig)("Heading", props);
  const { className, ...rest } = (0, import_system11.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    import_system11.chakra.h2,
    {
      ref,
      className: (0, import_shared_utils6.cx)("chakra-heading", props.className),
      ...rest,
      __css: styles
    }
  );
});
Heading.displayName = "Heading";

// src/highlight.tsx
var import_system12 = require("@chakra-ui/system");
var import_react2 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var escapeRegexp = (term) => term.replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`);
function buildRegex(query) {
  const _query = query.filter((text) => text.length !== 0).map((text) => escapeRegexp(text.trim()));
  if (!_query.length) {
    return null;
  }
  return new RegExp(`(${_query.join("|")})`, "ig");
}
function highlightWords({ text, query }) {
  const regex = buildRegex(Array.isArray(query) ? query : [query]);
  if (!regex) {
    return [{ text, match: false }];
  }
  const result = text.split(regex).filter(Boolean);
  return result.map((str) => ({ text: str, match: regex.test(str) }));
}
function useHighlight(props) {
  const { text, query } = props;
  return (0, import_react2.useMemo)(() => highlightWords({ text, query }), [text, query]);
}
var Mark = (0, import_system12.forwardRef)(function Mark2(props, ref) {
  const styles = (0, import_system12.useStyleConfig)("Mark", props);
  const ownProps = (0, import_system12.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    Box,
    {
      ref,
      ...ownProps,
      as: "mark",
      __css: { bg: "transparent", whiteSpace: "nowrap", ...styles }
    }
  );
});
function Highlight(props) {
  const { children, query, styles } = props;
  if (typeof children !== "string") {
    throw new Error("The children prop of Highlight must be a string");
  }
  const chunks = useHighlight({ query, text: children });
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_jsx_runtime12.Fragment, { children: chunks.map((chunk, index) => {
    return chunk.match ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Mark, { sx: styles, children: chunk.text }, index) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react2.Fragment, { children: chunk.text }, index);
  }) });
}

// src/kbd.tsx
var import_system13 = require("@chakra-ui/system");
var import_shared_utils7 = require("@chakra-ui/shared-utils");
var import_jsx_runtime13 = require("react/jsx-runtime");
var Kbd = (0, import_system13.forwardRef)(function Kbd2(props, ref) {
  const styles = (0, import_system13.useStyleConfig)("Kbd", props);
  const { className, ...rest } = (0, import_system13.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    import_system13.chakra.kbd,
    {
      ref,
      className: (0, import_shared_utils7.cx)("chakra-kbd", className),
      ...rest,
      __css: {
        fontFamily: "mono",
        ...styles
      }
    }
  );
});
Kbd.displayName = "Kbd";

// src/link.tsx
var import_system14 = require("@chakra-ui/system");
var import_shared_utils8 = require("@chakra-ui/shared-utils");
var import_jsx_runtime14 = require("react/jsx-runtime");
var Link = (0, import_system14.forwardRef)(function Link2(props, ref) {
  const styles = (0, import_system14.useStyleConfig)("Link", props);
  const { className, isExternal, ...rest } = (0, import_system14.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    import_system14.chakra.a,
    {
      target: isExternal ? "_blank" : void 0,
      rel: isExternal ? "noopener" : void 0,
      ref,
      className: (0, import_shared_utils8.cx)("chakra-link", className),
      ...rest,
      __css: styles
    }
  );
});
Link.displayName = "Link";

// src/link-box.tsx
var import_system15 = require("@chakra-ui/system");
var import_shared_utils9 = require("@chakra-ui/shared-utils");
var import_jsx_runtime15 = require("react/jsx-runtime");
var LinkOverlay = (0, import_system15.forwardRef)(
  function LinkOverlay2(props, ref) {
    const { isExternal, target, rel, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      import_system15.chakra.a,
      {
        ...rest,
        ref,
        className: (0, import_shared_utils9.cx)("chakra-linkbox__overlay", className),
        rel: isExternal ? "noopener noreferrer" : rel,
        target: isExternal ? "_blank" : target,
        __css: {
          position: "static",
          "&::before": {
            content: "''",
            cursor: "inherit",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%"
          }
        }
      }
    );
  }
);
var LinkBox = (0, import_system15.forwardRef)(function LinkBox2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    import_system15.chakra.div,
    {
      ref,
      position: "relative",
      ...rest,
      className: (0, import_shared_utils9.cx)("chakra-linkbox", className),
      __css: {
        /* Elevate the links and abbreviations up */
        "a[href]:not(.chakra-linkbox__overlay), abbr[title]": {
          position: "relative",
          zIndex: 1
        }
      }
    }
  );
});

// src/list.tsx
var import_icon = require("@chakra-ui/icon");
var import_react_context = require("@chakra-ui/react-context");
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_system16 = require("@chakra-ui/system");
var import_jsx_runtime16 = require("react/jsx-runtime");
var [ListStylesProvider, useListStyles] = (0, import_react_context.createContext)({
  name: `ListStylesContext`,
  errorMessage: `useListStyles returned is 'undefined'. Seems you forgot to wrap the components in "<List />" `
});
var List = (0, import_system16.forwardRef)(function List2(props, ref) {
  const styles = (0, import_system16.useMultiStyleConfig)("List", props);
  const {
    children,
    styleType = "none",
    stylePosition,
    spacing,
    ...rest
  } = (0, import_system16.omitThemingProps)(props);
  const validChildren = (0, import_react_children_utils.getValidChildren)(children);
  const selector = "& > *:not(style) ~ *:not(style)";
  const spacingStyle = spacing ? { [selector]: { mt: spacing } } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ListStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    import_system16.chakra.ul,
    {
      ref,
      listStyleType: styleType,
      listStylePosition: stylePosition,
      role: "list",
      __css: { ...styles.container, ...spacingStyle },
      ...rest,
      children: validChildren
    }
  ) });
});
List.displayName = "List";
var OrderedList = (0, import_system16.forwardRef)((props, ref) => {
  const { as, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(List, { ref, as: "ol", styleType: "decimal", marginStart: "1em", ...rest });
});
OrderedList.displayName = "OrderedList";
var UnorderedList = (0, import_system16.forwardRef)(function UnorderedList2(props, ref) {
  const { as, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(List, { ref, as: "ul", styleType: "initial", marginStart: "1em", ...rest });
});
UnorderedList.displayName = "UnorderedList";
var ListItem = (0, import_system16.forwardRef)(function ListItem2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_system16.chakra.li, { ref, ...props, __css: styles.item });
});
ListItem.displayName = "ListItem";
var ListIcon = (0, import_system16.forwardRef)(function ListIcon2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_icon.Icon, { ref, role: "presentation", ...props, __css: styles.icon });
});
ListIcon.displayName = "ListIcon";

// src/simple-grid.tsx
var import_system17 = require("@chakra-ui/system");
var import_breakpoint_utils3 = require("@chakra-ui/breakpoint-utils");
var import_jsx_runtime17 = require("react/jsx-runtime");
var SimpleGrid = (0, import_system17.forwardRef)(
  function SimpleGrid2(props, ref) {
    const { columns, spacingX, spacingY, spacing, minChildWidth, ...rest } = props;
    const theme = (0, import_system17.useTheme)();
    const templateColumns = minChildWidth ? widthToColumns(minChildWidth, theme) : countToColumns(columns);
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      Grid,
      {
        ref,
        gap: spacing,
        columnGap: spacingX,
        rowGap: spacingY,
        templateColumns,
        ...rest
      }
    );
  }
);
SimpleGrid.displayName = "SimpleGrid";
function toPx(n) {
  return typeof n === "number" ? `${n}px` : n;
}
function widthToColumns(width, theme) {
  return (0, import_breakpoint_utils3.mapResponsive)(width, (value) => {
    const _value = (0, import_system17.getToken)("sizes", value, toPx(value))(theme);
    return value === null ? null : `repeat(auto-fit, minmax(${_value}, 1fr))`;
  });
}
function countToColumns(count) {
  return (0, import_breakpoint_utils3.mapResponsive)(
    count,
    (value) => value === null ? null : `repeat(${value}, minmax(0, 1fr))`
  );
}

// src/spacer.tsx
var import_system18 = require("@chakra-ui/system");
var Spacer = (0, import_system18.chakra)("div", {
  baseStyle: {
    flex: 1,
    justifySelf: "stretch",
    alignSelf: "stretch"
  }
});
Spacer.displayName = "Spacer";

// src/stack/h-stack.tsx
var import_system21 = require("@chakra-ui/system");

// src/stack/stack.tsx
var import_react_children_utils2 = require("@chakra-ui/react-children-utils");
var import_shared_utils10 = require("@chakra-ui/shared-utils");
var import_system20 = require("@chakra-ui/system");
var import_react3 = require("react");

// src/stack/stack-item.tsx
var import_system19 = require("@chakra-ui/system");
var import_jsx_runtime18 = require("react/jsx-runtime");
var StackItem = (props) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
  import_system19.chakra.div,
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
var import_breakpoint_utils4 = require("@chakra-ui/breakpoint-utils");
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
    "&": (0, import_breakpoint_utils4.mapResponsive)(
      direction,
      (value) => dividerStyles[value]
    )
  };
}

// src/stack/stack.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
var Stack = (0, import_system20.forwardRef)((props, ref) => {
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
  const dividerStyle = (0, import_react3.useMemo)(
    () => getDividerStyles({ spacing, direction }),
    [spacing, direction]
  );
  const hasDivider = !!divider;
  const shouldUseChildren = !shouldWrapChildren && !hasDivider;
  const clones = (0, import_react3.useMemo)(() => {
    const validChildren = (0, import_react_children_utils2.getValidChildren)(children);
    return shouldUseChildren ? validChildren : validChildren.map((child, index) => {
      const key = typeof child.key !== "undefined" ? child.key : index;
      const isLast = index + 1 === validChildren.length;
      const wrappedChild = /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(StackItem, { children: child }, key);
      const _child = shouldWrapChildren ? wrappedChild : child;
      if (!hasDivider)
        return _child;
      const clonedDivider = (0, import_react3.cloneElement)(
        divider,
        {
          __css: dividerStyle
        }
      );
      const _divider = isLast ? null : clonedDivider;
      return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_react3.Fragment, { children: [
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
  const _className = (0, import_shared_utils10.cx)("chakra-stack", className);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
    import_system20.chakra.div,
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
var import_jsx_runtime20 = require("react/jsx-runtime");
var HStack = (0, import_system21.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Stack, { align: "center", ...props, direction: "row", ref }));
HStack.displayName = "HStack";

// src/stack/stack-divider.tsx
var import_system22 = require("@chakra-ui/system");
var import_jsx_runtime21 = require("react/jsx-runtime");
var StackDivider = (props) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  import_system22.chakra.div,
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
var import_system23 = require("@chakra-ui/system");
var import_jsx_runtime22 = require("react/jsx-runtime");
var VStack = (0, import_system23.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Stack, { align: "center", ...props, direction: "column", ref }));
VStack.displayName = "VStack";

// src/text.tsx
var import_system24 = require("@chakra-ui/system");
var import_shared_utils11 = require("@chakra-ui/shared-utils");
var import_object_utils2 = require("@chakra-ui/object-utils");
var import_jsx_runtime23 = require("react/jsx-runtime");
var Text = (0, import_system24.forwardRef)(function Text2(props, ref) {
  const styles = (0, import_system24.useStyleConfig)("Text", props);
  const { className, align, decoration, casing, ...rest } = (0, import_system24.omitThemingProps)(props);
  const aliasedProps = (0, import_object_utils2.compact)({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing
  });
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    import_system24.chakra.p,
    {
      ref,
      className: (0, import_shared_utils11.cx)("chakra-text", props.className),
      ...aliasedProps,
      ...rest,
      __css: styles
    }
  );
});
Text.displayName = "Text";

// src/wrap.tsx
var import_shared_utils12 = require("@chakra-ui/shared-utils");
var import_system25 = require("@chakra-ui/system");
var import_react4 = require("react");
var import_jsx_runtime24 = require("react/jsx-runtime");
var Wrap = (0, import_system25.forwardRef)(function Wrap2(props, ref) {
  const {
    spacing = "0.5rem",
    spacingX,
    spacingY,
    children,
    justify,
    direction,
    align,
    className,
    shouldWrapChildren,
    ...rest
  } = props;
  const _children = (0, import_react4.useMemo)(
    () => shouldWrapChildren ? import_react4.Children.map(children, (child, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(WrapItem, { children: child }, index)) : children,
    [children, shouldWrapChildren]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_system25.chakra.div, { ref, className: (0, import_shared_utils12.cx)("chakra-wrap", className), ...rest, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_system25.chakra.ul,
    {
      className: "chakra-wrap__list",
      __css: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify,
        alignItems: align,
        flexDirection: direction,
        listStyleType: "none",
        gap: spacing,
        columnGap: spacingX,
        rowGap: spacingY,
        padding: "0"
      },
      children: _children
    }
  ) });
});
Wrap.displayName = "Wrap";
var WrapItem = (0, import_system25.forwardRef)(function WrapItem2(props, ref) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_system25.chakra.li,
    {
      ref,
      __css: { display: "flex", alignItems: "flex-start" },
      className: (0, import_shared_utils12.cx)("chakra-wrap__listitem", className),
      ...rest
    }
  );
});
WrapItem.displayName = "WrapItem";

// src/indicator.tsx
var import_breakpoint_utils5 = require("@chakra-ui/breakpoint-utils");
var import_system26 = require("@chakra-ui/system");
var import_react5 = require("react");
var import_jsx_runtime25 = require("react/jsx-runtime");
var Indicator = (0, import_system26.forwardRef)(function Indicator2(props, ref) {
  const {
    offsetX,
    offsetY,
    offset = "0",
    placement = "top-end",
    ...rest
  } = props;
  const styles = (0, import_react5.useMemo)(
    () => ({
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      insetBlockStart: (0, import_breakpoint_utils5.mapResponsive)(placement, (v) => {
        const [side] = v.split("-");
        const map = {
          top: offsetY != null ? offsetY : offset,
          middle: "50%",
          bottom: "auto"
        };
        return map[side];
      }),
      insetBlockEnd: (0, import_breakpoint_utils5.mapResponsive)(placement, (v) => {
        const [side] = v.split("-");
        const map = {
          top: "auto",
          middle: "50%",
          bottom: offsetY != null ? offsetY : offset
        };
        return map[side];
      }),
      insetStart: (0, import_breakpoint_utils5.mapResponsive)(placement, (v) => {
        const [, align] = v.split("-");
        const map = {
          start: offsetX != null ? offsetX : offset,
          center: "50%",
          end: "auto"
        };
        return map[align];
      }),
      insetEnd: (0, import_breakpoint_utils5.mapResponsive)(placement, (v) => {
        const [, align] = v.split("-");
        const map = {
          start: "auto",
          center: "50%",
          end: offsetX != null ? offsetX : offset
        };
        return map[align];
      }),
      translate: (0, import_breakpoint_utils5.mapResponsive)(placement, (v) => {
        const [side, align] = v.split("-");
        const mapX = { start: "-50%", center: "-50%", end: "50%" };
        const mapY = { top: "-50%", middle: "-50%", bottom: "50%" };
        return `${mapX[align]} ${mapY[side]}`;
      })
    }),
    [offset, offsetX, offsetY, placement]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_system26.chakra.div, { ref, __css: styles, ...rest });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbsoluteCenter,
  AspectRatio,
  Badge,
  Box,
  Center,
  Circle,
  Code,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Highlight,
  Indicator,
  Kbd,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  ListIcon,
  ListItem,
  Mark,
  OrderedList,
  SimpleGrid,
  Spacer,
  Square,
  Stack,
  StackDivider,
  StackItem,
  Text,
  UnorderedList,
  VStack,
  Wrap,
  WrapItem,
  useHighlight,
  useListStyles
});
//# sourceMappingURL=index.js.map