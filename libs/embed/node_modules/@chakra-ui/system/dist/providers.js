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

// src/providers.tsx
var providers_exports = {};
__export(providers_exports, {
  CSSVars: () => CSSVars,
  GlobalStyle: () => GlobalStyle,
  StylesProvider: () => StylesProvider,
  ThemeProvider: () => ThemeProvider,
  createStylesContext: () => createStylesContext,
  useStyles: () => useStyles
});
module.exports = __toCommonJS(providers_exports);
var import_color_mode = require("@chakra-ui/color-mode");
var import_react_utils = require("@chakra-ui/react-utils");
var import_styled_system = require("@chakra-ui/styled-system");
var import_utils = require("@chakra-ui/utils");
var import_react = require("@emotion/react");
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function ThemeProvider(props) {
  const { cssVarsRoot, theme, children } = props;
  const computedTheme = (0, import_react2.useMemo)(() => (0, import_styled_system.toCSSVar)(theme), [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.ThemeProvider, { theme: computedTheme, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CSSVars, { root: cssVarsRoot }),
    children
  ] });
}
function CSSVars({ root = ":host, :root" }) {
  const selector = [root, `[data-theme]`].join(",");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Global, { styles: (theme) => ({ [selector]: theme.__cssVars }) });
}
var [StylesProvider, useStyles] = (0, import_react_utils.createContext)({
  name: "StylesContext",
  errorMessage: "useStyles: `styles` is undefined. Seems you forgot to wrap the components in `<StylesProvider />` "
});
function createStylesContext(componentName) {
  return (0, import_react_utils.createContext)({
    name: `${componentName}StylesContext`,
    errorMessage: `useStyles: "styles" is undefined. Seems you forgot to wrap the components in "<${componentName} />" `
  });
}
function GlobalStyle() {
  const { colorMode } = (0, import_color_mode.useColorMode)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react.Global,
    {
      styles: (theme) => {
        const styleObjectOrFn = (0, import_utils.memoizedGet)(theme, "styles.global");
        const globalStyles = (0, import_utils.runIfFn)(styleObjectOrFn, { theme, colorMode });
        if (!globalStyles)
          return void 0;
        const styles = (0, import_styled_system.css)(globalStyles)(theme);
        return styles;
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CSSVars,
  GlobalStyle,
  StylesProvider,
  ThemeProvider,
  createStylesContext,
  useStyles
});
//# sourceMappingURL=providers.js.map