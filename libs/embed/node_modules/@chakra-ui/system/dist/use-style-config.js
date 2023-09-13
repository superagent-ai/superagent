'use client'
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-style-config.ts
var use_style_config_exports = {};
__export(use_style_config_exports, {
  useComponentStyles__unstable: () => useComponentStyles__unstable,
  useMultiStyleConfig: () => useMultiStyleConfig,
  useStyleConfig: () => useStyleConfig
});
module.exports = __toCommonJS(use_style_config_exports);
var import_styled_system = require("@chakra-ui/styled-system");
var import_theme_utils = require("@chakra-ui/theme-utils");
var import_utils = require("@chakra-ui/utils");
var import_react3 = require("react");
var import_react_fast_compare = __toESM(require("react-fast-compare"));

// src/hooks.ts
var import_color_mode = require("@chakra-ui/color-mode");

// src/use-theme.ts
var import_react = require("@emotion/react");
var import_react2 = require("react");
function useTheme() {
  const theme = (0, import_react2.useContext)(
    import_react.ThemeContext
  );
  if (!theme) {
    throw Error(
      "useTheme: `theme` is undefined. Seems you forgot to wrap your app in `<ChakraProvider />` or `<ThemeProvider />`"
    );
  }
  return theme;
}

// src/hooks.ts
function useChakra() {
  const colorModeResult = (0, import_color_mode.useColorMode)();
  const theme = useTheme();
  return { ...colorModeResult, theme };
}

// src/use-style-config.ts
function useStyleConfigImpl(themeKey, props = {}) {
  var _a;
  const { styleConfig: styleConfigProp, ...rest } = props;
  const { theme, colorMode } = useChakra();
  const themeStyleConfig = themeKey ? (0, import_utils.memoizedGet)(theme, `components.${themeKey}`) : void 0;
  const styleConfig = styleConfigProp || themeStyleConfig;
  const mergedProps = (0, import_utils.mergeWith)(
    { theme, colorMode },
    (_a = styleConfig == null ? void 0 : styleConfig.defaultProps) != null ? _a : {},
    (0, import_utils.filterUndefined)((0, import_utils.omit)(rest, ["children"]))
  );
  const stylesRef = (0, import_react3.useRef)({});
  if (styleConfig) {
    const getStyles = (0, import_styled_system.resolveStyleConfig)(styleConfig);
    const styles = getStyles(mergedProps);
    const isStyleEqual = (0, import_react_fast_compare.default)(stylesRef.current, styles);
    if (!isStyleEqual) {
      stylesRef.current = styles;
    }
  }
  return stylesRef.current;
}
function useStyleConfig(themeKey, props = {}) {
  return useStyleConfigImpl(themeKey, props);
}
function useMultiStyleConfig(themeKey, props = {}) {
  return useStyleConfigImpl(themeKey, props);
}
function useComponentStyles__unstable(themeKey, props) {
  var _a;
  const { baseConfig, ...restProps } = props;
  const { theme } = useChakra();
  const overrides = (_a = theme.components) == null ? void 0 : _a[themeKey];
  const styleConfig = overrides ? (0, import_theme_utils.mergeThemeOverride)(overrides, baseConfig) : baseConfig;
  return useStyleConfigImpl(null, {
    ...restProps,
    styleConfig
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useComponentStyles__unstable,
  useMultiStyleConfig,
  useStyleConfig
});
//# sourceMappingURL=use-style-config.js.map