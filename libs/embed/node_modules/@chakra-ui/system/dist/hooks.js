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

// src/hooks.ts
var hooks_exports = {};
__export(hooks_exports, {
  getToken: () => getToken,
  useChakra: () => useChakra,
  useToken: () => useToken
});
module.exports = __toCommonJS(hooks_exports);
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
function getBreakpointValue(theme, value, fallback) {
  var _a, _b;
  if (value == null)
    return value;
  const getValue = (val) => {
    var _a2, _b2;
    return (_b2 = (_a2 = theme.__breakpoints) == null ? void 0 : _a2.asArray) == null ? void 0 : _b2[val];
  };
  return (_b = (_a = getValue(value)) != null ? _a : getValue(fallback)) != null ? _b : fallback;
}
function getTokenValue(theme, value, fallback) {
  var _a, _b;
  if (value == null)
    return value;
  const getValue = (val) => {
    var _a2, _b2;
    return (_b2 = (_a2 = theme.__cssMap) == null ? void 0 : _a2[val]) == null ? void 0 : _b2.value;
  };
  return (_b = (_a = getValue(value)) != null ? _a : getValue(fallback)) != null ? _b : fallback;
}
function useToken(scale, token, fallback) {
  const theme = useTheme();
  return getToken(scale, token, fallback)(theme);
}
function getToken(scale, token, fallback) {
  const _token = Array.isArray(token) ? token : [token];
  const _fallback = Array.isArray(fallback) ? fallback : [fallback];
  return (theme) => {
    const fallbackArr = _fallback.filter(Boolean);
    const result = _token.map((token2, index) => {
      var _a, _b;
      if (scale === "breakpoints") {
        return getBreakpointValue(theme, token2, (_a = fallbackArr[index]) != null ? _a : token2);
      }
      const path = `${scale}.${token2}`;
      return getTokenValue(theme, path, (_b = fallbackArr[index]) != null ? _b : token2);
    });
    return Array.isArray(token) ? result : result[0];
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getToken,
  useChakra,
  useToken
});
//# sourceMappingURL=hooks.js.map