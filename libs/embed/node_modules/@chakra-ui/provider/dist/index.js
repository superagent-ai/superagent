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
  ChakraProvider: () => ChakraProvider
});
module.exports = __toCommonJS(src_exports);

// src/chakra-provider.tsx
var import_css_reset = require("@chakra-ui/css-reset");
var import_portal = require("@chakra-ui/portal");
var import_system = require("@chakra-ui/system");
var import_react_env = require("@chakra-ui/react-env");
var import_jsx_runtime = require("react/jsx-runtime");
var ChakraProvider = (props) => {
  const {
    children,
    colorModeManager,
    portalZIndex,
    resetScope,
    resetCSS = true,
    theme = {},
    environment,
    cssVarsRoot,
    disableEnvironment,
    disableGlobalStyle
  } = props;
  const _children = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_env.EnvironmentProvider,
    {
      environment,
      disabled: disableEnvironment,
      children
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.ThemeProvider, { theme, cssVarsRoot, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_system.ColorModeProvider,
    {
      colorModeManager,
      options: theme.config,
      children: [
        resetCSS ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_css_reset.CSSReset, { scope: resetScope }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_css_reset.CSSPolyfill, {}),
        !disableGlobalStyle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.GlobalStyle, {}),
        portalZIndex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_portal.PortalManager, { zIndex: portalZIndex, children: _children }) : _children
      ]
    }
  ) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChakraProvider
});
//# sourceMappingURL=index.js.map