'use client'

// src/list.tsx
import { Icon } from "@chakra-ui/icon";
import { createContext } from "@chakra-ui/react-context";
import { getValidChildren } from "@chakra-ui/react-children-utils";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var [ListStylesProvider, useListStyles] = createContext({
  name: `ListStylesContext`,
  errorMessage: `useListStyles returned is 'undefined'. Seems you forgot to wrap the components in "<List />" `
});
var List = forwardRef(function List2(props, ref) {
  const styles = useMultiStyleConfig("List", props);
  const {
    children,
    styleType = "none",
    stylePosition,
    spacing,
    ...rest
  } = omitThemingProps(props);
  const validChildren = getValidChildren(children);
  const selector = "& > *:not(style) ~ *:not(style)";
  const spacingStyle = spacing ? { [selector]: { mt: spacing } } : {};
  return /* @__PURE__ */ jsx(ListStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
    chakra.ul,
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
var OrderedList = forwardRef((props, ref) => {
  const { as, ...rest } = props;
  return /* @__PURE__ */ jsx(List, { ref, as: "ol", styleType: "decimal", marginStart: "1em", ...rest });
});
OrderedList.displayName = "OrderedList";
var UnorderedList = forwardRef(function UnorderedList2(props, ref) {
  const { as, ...rest } = props;
  return /* @__PURE__ */ jsx(List, { ref, as: "ul", styleType: "initial", marginStart: "1em", ...rest });
});
UnorderedList.displayName = "UnorderedList";
var ListItem = forwardRef(function ListItem2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ jsx(chakra.li, { ref, ...props, __css: styles.item });
});
ListItem.displayName = "ListItem";
var ListIcon = forwardRef(function ListIcon2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ jsx(Icon, { ref, role: "presentation", ...props, __css: styles.icon });
});
ListIcon.displayName = "ListIcon";

export {
  useListStyles,
  List,
  OrderedList,
  UnorderedList,
  ListItem,
  ListIcon
};
//# sourceMappingURL=chunk-46CXQZ4E.mjs.map