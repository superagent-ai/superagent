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

// src/alert-description.tsx
var alert_description_exports = {};
__export(alert_description_exports, {
  AlertDescription: () => AlertDescription
});
module.exports = __toCommonJS(alert_description_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");

// src/alert-context.ts
var import_react_context = require("@chakra-ui/react-context");
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

// src/alert-description.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AlertDescription = (0, import_system.forwardRef)(
  function AlertDescription2(props, ref) {
    const styles = useAlertStyles();
    const { status } = useAlertContext();
    const descriptionStyles = {
      display: "inline",
      ...styles.description
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        "data-status": status,
        ...props,
        className: (0, import_shared_utils.cx)("chakra-alert__desc", props.className),
        __css: descriptionStyles
      }
    );
  }
);
AlertDescription.displayName = "AlertDescription";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlertDescription
});
//# sourceMappingURL=alert-description.js.map