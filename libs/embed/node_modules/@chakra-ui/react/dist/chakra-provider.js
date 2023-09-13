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

// src/chakra-provider.tsx
var chakra_provider_exports = {};
__export(chakra_provider_exports, {
  ChakraBaseProvider: () => ChakraBaseProvider,
  ChakraProvider: () => ChakraProvider
});
module.exports = __toCommonJS(chakra_provider_exports);
var import_provider = require("@chakra-ui/provider");
var import_theme = require("@chakra-ui/theme");
var import_toast = require("@chakra-ui/toast");
var import_jsx_runtime = require("react/jsx-runtime");
var createChakraProvider = (providerTheme) => {
  return function ChakraProvider2({
    children,
    theme = providerTheme,
    toastOptions,
    ...restProps
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_provider.ChakraProvider, { theme, ...restProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_toast.ToastOptionProvider, { value: toastOptions == null ? void 0 : toastOptions.defaultOptions, children }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_toast.ToastProvider, { ...toastOptions })
    ] });
  };
};
var ChakraProvider = createChakraProvider(import_theme.theme);
var ChakraBaseProvider = createChakraProvider(import_theme.baseTheme);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChakraBaseProvider,
  ChakraProvider
});
//# sourceMappingURL=chakra-provider.js.map