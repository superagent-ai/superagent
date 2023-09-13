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

// src/tag.tsx
var tag_exports = {};
__export(tag_exports, {
  Tag: () => Tag,
  TagCloseButton: () => TagCloseButton,
  TagLabel: () => TagLabel,
  TagLeftIcon: () => TagLeftIcon,
  TagRightIcon: () => TagRightIcon,
  useTagStyles: () => useTagStyles
});
module.exports = __toCommonJS(tag_exports);
var import_icon = require("@chakra-ui/icon");
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var [TagStylesProvider, useTagStyles] = (0, import_react_context.createContext)({
  name: `TagStylesContext`,
  errorMessage: `useTagStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Tag />" `
});
var Tag = (0, import_system.forwardRef)((props, ref) => {
  const styles = (0, import_system.useMultiStyleConfig)("Tag", props);
  const ownProps = (0, import_system.omitThemingProps)(props);
  const containerStyles = {
    display: "inline-flex",
    verticalAlign: "top",
    alignItems: "center",
    maxWidth: "100%",
    ...styles.container
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.span, { ref, ...ownProps, __css: containerStyles }) });
});
Tag.displayName = "Tag";
var TagLabel = (0, import_system.forwardRef)((props, ref) => {
  const styles = useTagStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.span, { ref, noOfLines: 1, ...props, __css: styles.label });
});
TagLabel.displayName = "TagLabel";
var TagLeftIcon = (0, import_system.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { ref, verticalAlign: "top", marginEnd: "0.5rem", ...props }));
TagLeftIcon.displayName = "TagLeftIcon";
var TagRightIcon = (0, import_system.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { ref, verticalAlign: "top", marginStart: "0.5rem", ...props }));
TagRightIcon.displayName = "TagRightIcon";
var TagCloseIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { verticalAlign: "inherit", viewBox: "0 0 512 512", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
  }
) });
TagCloseIcon.displayName = "TagCloseIcon";
var TagCloseButton = (0, import_system.forwardRef)(
  (props, ref) => {
    const { isDisabled, children, ...rest } = props;
    const styles = useTagStyles();
    const btnStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "0",
      ...styles.closeButton
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.button,
      {
        ref,
        "aria-label": "close",
        ...rest,
        type: "button",
        disabled: isDisabled,
        __css: btnStyles,
        children: children || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagCloseIcon, {})
      }
    );
  }
);
TagCloseButton.displayName = "TagCloseButton";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  useTagStyles
});
//# sourceMappingURL=tag.js.map