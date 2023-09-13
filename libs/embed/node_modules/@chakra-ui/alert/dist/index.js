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
  Alert: () => Alert,
  AlertDescription: () => AlertDescription,
  AlertIcon: () => AlertIcon,
  AlertTitle: () => AlertTitle,
  useAlertStyles: () => useAlertStyles
});
module.exports = __toCommonJS(src_exports);

// src/alert.tsx
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");

// src/alert-context.ts
var import_react_context = require("@chakra-ui/react-context");

// src/icons.tsx
var import_icon = require("@chakra-ui/icon");
var import_jsx_runtime = require("react/jsx-runtime");
function CheckIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
    }
  ) });
}
function InfoIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z"
    }
  ) });
}
function WarningIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
    }
  ) });
}

// src/alert-context.ts
var import_spinner = require("@chakra-ui/spinner");
var [AlertProvider, useAlertContext] = (0, import_react_context.createContext)({
  name: "AlertContext",
  hookName: "useAlertContext",
  providerName: "<Alert />"
});
var [AlertStylesProvider, useAlertStyles] = (0, import_react_context.createContext)({
  name: `AlertStylesContext`,
  hookName: `useAlertStyles`,
  providerName: "<Alert />"
});
var STATUSES = {
  info: { icon: InfoIcon, colorScheme: "blue" },
  warning: { icon: WarningIcon, colorScheme: "orange" },
  success: { icon: CheckIcon, colorScheme: "green" },
  error: { icon: WarningIcon, colorScheme: "red" },
  loading: { icon: import_spinner.Spinner, colorScheme: "blue" }
};
function getStatusColorScheme(status) {
  return STATUSES[status].colorScheme;
}
function getStatusIcon(status) {
  return STATUSES[status].icon;
}

// src/alert.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Alert = (0, import_system.forwardRef)(function Alert2(props, ref) {
  var _a;
  const { status = "info", addRole = true, ...rest } = (0, import_system.omitThemingProps)(props);
  const colorScheme = (_a = props.colorScheme) != null ? _a : getStatusColorScheme(status);
  const styles = (0, import_system.useMultiStyleConfig)("Alert", { ...props, colorScheme });
  const alertStyles = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    ...styles.container
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AlertProvider, { value: { status }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AlertStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system.chakra.div,
    {
      "data-status": status,
      role: addRole ? "alert" : void 0,
      ref,
      ...rest,
      className: (0, import_shared_utils.cx)("chakra-alert", props.className),
      __css: alertStyles
    }
  ) }) });
});
Alert.displayName = "Alert";

// src/alert-description.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime3 = require("react/jsx-runtime");
var AlertDescription = (0, import_system2.forwardRef)(
  function AlertDescription2(props, ref) {
    const styles = useAlertStyles();
    const { status } = useAlertContext();
    const descriptionStyles = {
      display: "inline",
      ...styles.description
    };
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_system2.chakra.div,
      {
        ref,
        "data-status": status,
        ...props,
        className: (0, import_shared_utils2.cx)("chakra-alert__desc", props.className),
        __css: descriptionStyles
      }
    );
  }
);
AlertDescription.displayName = "AlertDescription";

// src/alert-icon.tsx
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime4 = require("react/jsx-runtime");
function AlertIcon(props) {
  const { status } = useAlertContext();
  const BaseIcon = getStatusIcon(status);
  const styles = useAlertStyles();
  const css = status === "loading" ? styles.spinner : styles.icon;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_system3.chakra.span,
    {
      display: "inherit",
      "data-status": status,
      ...props,
      className: (0, import_shared_utils3.cx)("chakra-alert__icon", props.className),
      __css: css,
      children: props.children || /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BaseIcon, { h: "100%", w: "100%" })
    }
  );
}
AlertIcon.displayName = "AlertIcon";

// src/alert-title.tsx
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var AlertTitle = (0, import_system4.forwardRef)(
  function AlertTitle2(props, ref) {
    const styles = useAlertStyles();
    const { status } = useAlertContext();
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_system4.chakra.div,
      {
        ref,
        "data-status": status,
        ...props,
        className: (0, import_shared_utils4.cx)("chakra-alert__title", props.className),
        __css: styles.title
      }
    );
  }
);
AlertTitle.displayName = "AlertTitle";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  useAlertStyles
});
//# sourceMappingURL=index.js.map