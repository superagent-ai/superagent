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

// src/list.tsx
var list_exports = {};
__export(list_exports, {
  List: () => List,
  ListIcon: () => ListIcon,
  ListItem: () => ListItem,
  OrderedList: () => OrderedList,
  UnorderedList: () => UnorderedList,
  useListStyles: () => useListStyles
});
module.exports = __toCommonJS(list_exports);
var import_icon = require("@chakra-ui/icon");
var import_react_context = require("@chakra-ui/react-context");
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var [ListStylesProvider, useListStyles] = (0, import_react_context.createContext)({
  name: `ListStylesContext`,
  errorMessage: `useListStyles returned is 'undefined'. Seems you forgot to wrap the components in "<List />" `
});
var List = (0, import_system.forwardRef)(function List2(props, ref) {
  const styles = (0, import_system.useMultiStyleConfig)("List", props);
  const {
    children,
    styleType = "none",
    stylePosition,
    spacing,
    ...rest
  } = (0, import_system.omitThemingProps)(props);
  const validChildren = (0, import_react_children_utils.getValidChildren)(children);
  const selector = "& > *:not(style) ~ *:not(style)";
  const spacingStyle = spacing ? { [selector]: { mt: spacing } } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.ul,
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
var OrderedList = (0, import_system.forwardRef)((props, ref) => {
  const { as, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { ref, as: "ol", styleType: "decimal", marginStart: "1em", ...rest });
});
OrderedList.displayName = "OrderedList";
var UnorderedList = (0, import_system.forwardRef)(function UnorderedList2(props, ref) {
  const { as, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { ref, as: "ul", styleType: "initial", marginStart: "1em", ...rest });
});
UnorderedList.displayName = "UnorderedList";
var ListItem = (0, import_system.forwardRef)(function ListItem2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.li, { ref, ...props, __css: styles.item });
});
ListItem.displayName = "ListItem";
var ListIcon = (0, import_system.forwardRef)(function ListIcon2(props, ref) {
  const styles = useListStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { ref, role: "presentation", ...props, __css: styles.icon });
});
ListIcon.displayName = "ListIcon";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  List,
  ListIcon,
  ListItem,
  OrderedList,
  UnorderedList,
  useListStyles
});
//# sourceMappingURL=list.js.map