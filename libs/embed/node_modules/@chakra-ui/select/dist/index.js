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
  Select: () => Select,
  SelectField: () => SelectField
});
module.exports = __toCommonJS(src_exports);

// src/select.tsx
var import_form_control = require("@chakra-ui/form-control");
var import_system2 = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");

// ../../utilities/object-utils/src/split.ts
function split(object, keys) {
  const picked = {};
  const omitted = {};
  for (const [key, value] of Object.entries(object)) {
    if (keys.includes(key))
      picked[key] = value;
    else
      omitted[key] = value;
  }
  return [picked, omitted];
}

// src/select.tsx
var import_react = require("react");

// src/select-field.tsx
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var SelectField = (0, import_system.forwardRef)(
  function SelectField2(props, ref) {
    const { children, placeholder, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_system.chakra.select,
      {
        ...rest,
        ref,
        className: (0, import_shared_utils.cx)("chakra-select", className),
        children: [
          placeholder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: placeholder }),
          children
        ]
      }
    );
  }
);
SelectField.displayName = "SelectField";

// src/select.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Select = (0, import_system2.forwardRef)((props, ref) => {
  var _a;
  const styles = (0, import_system2.useMultiStyleConfig)("Select", props);
  const {
    rootProps,
    placeholder,
    icon,
    color,
    height,
    h,
    minH,
    minHeight,
    iconColor,
    iconSize,
    ...rest
  } = (0, import_system2.omitThemingProps)(props);
  const [layoutProps, otherProps] = split(rest, import_system2.layoutPropNames);
  const ownProps = (0, import_form_control.useFormControl)(otherProps);
  const rootStyles = {
    width: "100%",
    height: "fit-content",
    position: "relative",
    color
  };
  const fieldStyles = {
    paddingEnd: "2rem",
    ...styles.field,
    _focus: {
      zIndex: "unset",
      ...(_a = styles.field) == null ? void 0 : _a["_focus"]
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_system2.chakra.div,
    {
      className: "chakra-select__wrapper",
      __css: rootStyles,
      ...layoutProps,
      ...rootProps,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          SelectField,
          {
            ref,
            height: h != null ? h : height,
            minH: minH != null ? minH : minHeight,
            placeholder,
            ...ownProps,
            __css: fieldStyles,
            children: props.children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          SelectIcon,
          {
            "data-disabled": (0, import_shared_utils2.dataAttr)(ownProps.disabled),
            ...(iconColor || color) && { color: iconColor || color },
            __css: styles.icon,
            ...iconSize && { fontSize: iconSize },
            children: icon
          }
        )
      ]
    }
  );
});
Select.displayName = "Select";
var DefaultIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
  }
) });
var IconWrapper = (0, import_system2.chakra)("div", {
  baseStyle: {
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    top: "50%",
    transform: "translateY(-50%)"
  }
});
var SelectIcon = (props) => {
  const { children = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DefaultIcon, {}), ...rest } = props;
  const clone = (0, import_react.cloneElement)(children, {
    role: "presentation",
    className: "chakra-select__icon",
    focusable: false,
    "aria-hidden": true,
    // force icon to adhere to `IconWrapper` styles
    style: {
      width: "1em",
      height: "1em",
      color: "currentColor"
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(IconWrapper, { ...rest, className: "chakra-select__icon-wrapper", children: (0, import_react.isValidElement)(children) ? clone : null });
};
SelectIcon.displayName = "SelectIcon";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Select,
  SelectField
});
//# sourceMappingURL=index.js.map