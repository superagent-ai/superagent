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

// src/input-element.tsx
var input_element_exports = {};
__export(input_element_exports, {
  InputLeftElement: () => InputLeftElement,
  InputRightElement: () => InputRightElement
});
module.exports = __toCommonJS(input_element_exports);
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");

// src/input-group.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_object_utils = require("@chakra-ui/object-utils");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var [InputGroupStylesProvider, useInputGroupStyles] = (0, import_react_context.createContext)({
  name: `InputGroupStylesContext`,
  errorMessage: `useInputGroupStyles returned is 'undefined'. Seems you forgot to wrap the components in "<InputGroup />" `
});
var InputGroup = (0, import_system.forwardRef)(
  function InputGroup2(props, ref) {
    const styles = (0, import_system.useMultiStyleConfig)("Input", props);
    const { children, className, ...rest } = (0, import_system.omitThemingProps)(props);
    const _className = (0, import_shared_utils.cx)("chakra-input__group", className);
    const groupStyles = {};
    const validChildren = (0, import_react_children_utils.getValidChildren)(children);
    const input = styles.field;
    validChildren.forEach((child) => {
      var _a, _b;
      if (!styles)
        return;
      if (input && child.type.id === "InputLeftElement") {
        groupStyles.paddingStart = (_a = input.height) != null ? _a : input.h;
      }
      if (input && child.type.id === "InputRightElement") {
        groupStyles.paddingEnd = (_b = input.height) != null ? _b : input.h;
      }
      if (child.type.id === "InputRightAddon") {
        groupStyles.borderEndRadius = 0;
      }
      if (child.type.id === "InputLeftAddon") {
        groupStyles.borderStartRadius = 0;
      }
    });
    const clones = validChildren.map((child) => {
      var _a, _b;
      const theming = (0, import_object_utils.compact)({
        size: ((_a = child.props) == null ? void 0 : _a.size) || props.size,
        variant: ((_b = child.props) == null ? void 0 : _b.variant) || props.variant
      });
      return child.type.id !== "Input" ? (0, import_react.cloneElement)(child, theming) : (0, import_react.cloneElement)(child, Object.assign(theming, groupStyles, child.props));
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        className: _className,
        ref,
        __css: {
          width: "100%",
          display: "flex",
          position: "relative",
          // Parts of inputs override z-index to ensure that they stack correctly on each other
          // Create a new stacking context so that these overrides don't leak out and conflict with other z-indexes
          isolation: "isolate",
          ...styles.group
        },
        "data-group": true,
        ...rest,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupStylesProvider, { value: styles, children: clones })
      }
    );
  }
);
InputGroup.displayName = "InputGroup";

// src/input-element.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var StyledInputElement = (0, import_system2.chakra)("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0",
    zIndex: 2
  }
});
var InputElement = (0, import_system2.forwardRef)(function InputElement2(props, ref) {
  var _a, _b;
  const { placement = "left", ...rest } = props;
  const styles = useInputGroupStyles();
  const input = styles.field;
  const attr = placement === "left" ? "insetStart" : "insetEnd";
  const elementStyles = {
    [attr]: "0",
    width: (_a = input == null ? void 0 : input.height) != null ? _a : input == null ? void 0 : input.h,
    height: (_b = input == null ? void 0 : input.height) != null ? _b : input == null ? void 0 : input.h,
    fontSize: input == null ? void 0 : input.fontSize,
    ...styles.element
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StyledInputElement, { ref, __css: elementStyles, ...rest });
});
InputElement.id = "InputElement";
InputElement.displayName = "InputElement";
var InputLeftElement = (0, import_system2.forwardRef)(
  function InputLeftElement2(props, ref) {
    const { className, ...rest } = props;
    const _className = (0, import_shared_utils2.cx)("chakra-input__left-element", className);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      InputElement,
      {
        ref,
        placement: "left",
        className: _className,
        ...rest
      }
    );
  }
);
InputLeftElement.id = "InputLeftElement";
InputLeftElement.displayName = "InputLeftElement";
var InputRightElement = (0, import_system2.forwardRef)(
  function InputRightElement2(props, ref) {
    const { className, ...rest } = props;
    const _className = (0, import_shared_utils2.cx)("chakra-input__right-element", className);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      InputElement,
      {
        ref,
        placement: "right",
        className: _className,
        ...rest
      }
    );
  }
);
InputRightElement.id = "InputRightElement";
InputRightElement.displayName = "InputRightElement";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InputLeftElement,
  InputRightElement
});
//# sourceMappingURL=input-element.js.map