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
  EnvironmentProvider: () => EnvironmentProvider,
  useEnvironment: () => useEnvironment
});
module.exports = __toCommonJS(src_exports);

// src/env.tsx
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var EnvironmentContext = (0, import_react.createContext)({
  getDocument() {
    return document;
  },
  getWindow() {
    return window;
  }
});
EnvironmentContext.displayName = "EnvironmentContext";
function useEnvironment({ defer } = {}) {
  const [, forceUpdate] = (0, import_react.useReducer)((c) => c + 1, 0);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!defer)
      return;
    forceUpdate();
  }, [defer]);
  return (0, import_react.useContext)(EnvironmentContext);
}
function EnvironmentProvider(props) {
  const { children, environment: environmentProp, disabled } = props;
  const ref = (0, import_react.useRef)(null);
  const context = (0, import_react.useMemo)(() => {
    if (environmentProp)
      return environmentProp;
    return {
      getDocument: () => {
        var _a, _b;
        return (_b = (_a = ref.current) == null ? void 0 : _a.ownerDocument) != null ? _b : document;
      },
      getWindow: () => {
        var _a, _b;
        return (_b = (_a = ref.current) == null ? void 0 : _a.ownerDocument.defaultView) != null ? _b : window;
      }
    };
  }, [environmentProp]);
  const showSpan = !disabled || !environmentProp;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnvironmentContext.Provider, { value: context, children: [
    children,
    showSpan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { id: "__chakra_env", hidden: true, ref })
  ] });
}
EnvironmentProvider.displayName = "EnvironmentProvider";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EnvironmentProvider,
  useEnvironment
});
//# sourceMappingURL=index.js.map