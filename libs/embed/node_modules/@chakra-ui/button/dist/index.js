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
  Button: () => Button,
  ButtonGroup: () => ButtonGroup,
  ButtonSpinner: () => ButtonSpinner,
  IconButton: () => IconButton,
  useButtonGroup: () => useButtonGroup
});
module.exports = __toCommonJS(src_exports);

// src/button.tsx
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_system3 = require("@chakra-ui/system");
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_react4 = require("react");

// src/button-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [ButtonGroupProvider, useButtonGroup] = (0, import_react_context.createContext)({
  strict: false,
  name: "ButtonGroupContext"
});

// src/button-icon.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function ButtonIcon(props) {
  const { children, className, ...rest } = props;
  const _children = (0, import_react.isValidElement)(children) ? (0, import_react.cloneElement)(children, {
    "aria-hidden": true,
    focusable: false
  }) : children;
  const _className = (0, import_shared_utils.cx)("chakra-button__icon", className);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.span,
    {
      display: "inline-flex",
      alignSelf: "center",
      flexShrink: 0,
      ...rest,
      className: _className,
      children: _children
    }
  );
}
ButtonIcon.displayName = "ButtonIcon";

// src/button-spinner.tsx
var import_spinner = require("@chakra-ui/spinner");
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function ButtonSpinner(props) {
  const {
    label,
    placement,
    spacing = "0.5rem",
    children = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_spinner.Spinner, { color: "currentColor", width: "1em", height: "1em" }),
    className,
    __css,
    ...rest
  } = props;
  const _className = (0, import_shared_utils2.cx)("chakra-button__spinner", className);
  const marginProp = placement === "start" ? "marginEnd" : "marginStart";
  const spinnerStyles = (0, import_react2.useMemo)(
    () => ({
      display: "flex",
      alignItems: "center",
      position: label ? "relative" : "absolute",
      [marginProp]: label ? spacing : 0,
      fontSize: "1em",
      lineHeight: "normal",
      ...__css
    }),
    [__css, label, marginProp, spacing]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system2.chakra.div, { className: _className, ...rest, __css: spinnerStyles, children });
}
ButtonSpinner.displayName = "ButtonSpinner";

// src/use-button-type.tsx
var import_react3 = require("react");
function useButtonType(value) {
  const [isButton, setIsButton] = (0, import_react3.useState)(!value);
  const refCallback = (0, import_react3.useCallback)((node) => {
    if (!node)
      return;
    setIsButton(node.tagName === "BUTTON");
  }, []);
  const type = isButton ? "button" : void 0;
  return { ref: refCallback, type };
}

// src/button.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var Button = (0, import_system3.forwardRef)((props, ref) => {
  const group = useButtonGroup();
  const styles = (0, import_system3.useStyleConfig)("Button", { ...group, ...props });
  const {
    isDisabled = group == null ? void 0 : group.isDisabled,
    isLoading,
    isActive,
    children,
    leftIcon,
    rightIcon,
    loadingText,
    iconSpacing = "0.5rem",
    type,
    spinner,
    spinnerPlacement = "start",
    className,
    as,
    ...rest
  } = (0, import_system3.omitThemingProps)(props);
  const buttonStyles = (0, import_react4.useMemo)(() => {
    const _focus = { ...styles == null ? void 0 : styles["_focus"], zIndex: 1 };
    return {
      display: "inline-flex",
      appearance: "none",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      position: "relative",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      outline: "none",
      ...styles,
      ...!!group && { _focus }
    };
  }, [styles, group]);
  const { ref: _ref, type: defaultType } = useButtonType(as);
  const contentProps = { rightIcon, leftIcon, iconSpacing, children };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_system3.chakra.button,
    {
      ref: (0, import_react_use_merge_refs.useMergeRefs)(ref, _ref),
      as,
      type: type != null ? type : defaultType,
      "data-active": (0, import_shared_utils3.dataAttr)(isActive),
      "data-loading": (0, import_shared_utils3.dataAttr)(isLoading),
      __css: buttonStyles,
      className: (0, import_shared_utils3.cx)("chakra-button", className),
      ...rest,
      disabled: isDisabled || isLoading,
      children: [
        isLoading && spinnerPlacement === "start" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          ButtonSpinner,
          {
            className: "chakra-button__spinner--start",
            label: loadingText,
            placement: "start",
            spacing: iconSpacing,
            children: spinner
          }
        ),
        isLoading ? loadingText || /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_system3.chakra.span, { opacity: 0, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonContent, { ...contentProps }) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonContent, { ...contentProps }),
        isLoading && spinnerPlacement === "end" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          ButtonSpinner,
          {
            className: "chakra-button__spinner--end",
            label: loadingText,
            placement: "end",
            spacing: iconSpacing,
            children: spinner
          }
        )
      ]
    }
  );
});
Button.displayName = "Button";
function ButtonContent(props) {
  const { leftIcon, rightIcon, children, iconSpacing } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    leftIcon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonIcon, { marginEnd: iconSpacing, children: leftIcon }),
    children,
    rightIcon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ButtonIcon, { marginStart: iconSpacing, children: rightIcon })
  ] });
}

// src/button-group.tsx
var import_system4 = require("@chakra-ui/system");
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_react5 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var attachedStyles = {
  horizontal: {
    "> *:first-of-type:not(:last-of-type)": { borderEndRadius: 0 },
    "> *:not(:first-of-type):not(:last-of-type)": { borderRadius: 0 },
    "> *:not(:first-of-type):last-of-type": { borderStartRadius: 0 }
  },
  vertical: {
    "> *:first-of-type:not(:last-of-type)": { borderBottomRadius: 0 },
    "> *:not(:first-of-type):not(:last-of-type)": { borderRadius: 0 },
    "> *:not(:first-of-type):last-of-type": { borderTopRadius: 0 }
  }
};
var gapStyles = {
  horizontal: (spacing) => ({
    "& > *:not(style) ~ *:not(style)": { marginStart: spacing }
  }),
  vertical: (spacing) => ({
    "& > *:not(style) ~ *:not(style)": { marginTop: spacing }
  })
};
var ButtonGroup = (0, import_system4.forwardRef)(
  function ButtonGroup2(props, ref) {
    const {
      size,
      colorScheme,
      variant,
      className,
      spacing = "0.5rem",
      isAttached,
      isDisabled,
      orientation = "horizontal",
      ...rest
    } = props;
    const _className = (0, import_shared_utils4.cx)("chakra-button__group", className);
    const context = (0, import_react5.useMemo)(
      () => ({ size, colorScheme, variant, isDisabled }),
      [size, colorScheme, variant, isDisabled]
    );
    let groupStyles = {
      display: "inline-flex",
      ...isAttached ? attachedStyles[orientation] : gapStyles[orientation](spacing)
    };
    const isVertical = orientation === "vertical";
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ButtonGroupProvider, { value: context, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system4.chakra.div,
      {
        ref,
        role: "group",
        __css: groupStyles,
        className: _className,
        "data-attached": isAttached ? "" : void 0,
        "data-orientation": orientation,
        flexDir: isVertical ? "column" : void 0,
        ...rest
      }
    ) });
  }
);
ButtonGroup.displayName = "ButtonGroup";

// src/icon-button.tsx
var import_system5 = require("@chakra-ui/system");
var import_react6 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var IconButton = (0, import_system5.forwardRef)(
  (props, ref) => {
    const { icon, children, isRound, "aria-label": ariaLabel, ...rest } = props;
    const element = icon || children;
    const _children = (0, import_react6.isValidElement)(element) ? (0, import_react6.cloneElement)(element, {
      "aria-hidden": true,
      focusable: false
    }) : null;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Button,
      {
        padding: "0",
        borderRadius: isRound ? "full" : void 0,
        ref,
        "aria-label": ariaLabel,
        ...rest,
        children: _children
      }
    );
  }
);
IconButton.displayName = "IconButton";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  ButtonGroup,
  ButtonSpinner,
  IconButton,
  useButtonGroup
});
//# sourceMappingURL=index.js.map