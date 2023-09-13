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

// src/switch.tsx
var switch_exports = {};
__export(switch_exports, {
  Switch: () => Switch
});
module.exports = __toCommonJS(switch_exports);
var import_checkbox = require("@chakra-ui/checkbox");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var Switch = (0, import_system.forwardRef)(function Switch2(props, ref) {
  const styles = (0, import_system.useMultiStyleConfig)("Switch", props);
  const { spacing = "0.5rem", children, ...ownProps } = (0, import_system.omitThemingProps)(props);
  const {
    getIndicatorProps,
    getInputProps,
    getCheckboxProps,
    getRootProps,
    getLabelProps
  } = (0, import_checkbox.useCheckbox)(ownProps);
  const containerStyles = (0, import_react.useMemo)(
    () => ({
      display: "inline-block",
      position: "relative",
      verticalAlign: "middle",
      lineHeight: 0,
      ...styles.container
    }),
    [styles.container]
  );
  const trackStyles = (0, import_react.useMemo)(
    () => ({
      display: "inline-flex",
      flexShrink: 0,
      justifyContent: "flex-start",
      boxSizing: "content-box",
      cursor: "pointer",
      ...styles.track
    }),
    [styles.track]
  );
  const labelStyles = (0, import_react.useMemo)(
    () => ({
      userSelect: "none",
      marginStart: spacing,
      ...styles.label
    }),
    [spacing, styles.label]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_system.chakra.label,
    {
      ...getRootProps(),
      className: (0, import_shared_utils.cx)("chakra-switch", props.className),
      __css: containerStyles,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "chakra-switch__input", ...getInputProps({}, ref) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_system.chakra.span,
          {
            ...getCheckboxProps(),
            className: "chakra-switch__track",
            __css: trackStyles,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_system.chakra.span,
              {
                __css: styles.thumb,
                className: "chakra-switch__thumb",
                ...getIndicatorProps()
              }
            )
          }
        ),
        children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_system.chakra.span,
          {
            className: "chakra-switch__label",
            ...getLabelProps(),
            __css: labelStyles,
            children
          }
        )
      ]
    }
  );
});
Switch.displayName = "Switch";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Switch
});
//# sourceMappingURL=switch.js.map