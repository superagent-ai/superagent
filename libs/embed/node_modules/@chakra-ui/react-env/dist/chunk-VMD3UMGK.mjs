'use client'

// src/env.tsx
import { useSafeLayoutEffect } from "@chakra-ui/react-use-safe-layout-effect";
import { createContext, useContext, useMemo, useReducer, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var EnvironmentContext = createContext({
  getDocument() {
    return document;
  },
  getWindow() {
    return window;
  }
});
EnvironmentContext.displayName = "EnvironmentContext";
function useEnvironment({ defer } = {}) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  useSafeLayoutEffect(() => {
    if (!defer)
      return;
    forceUpdate();
  }, [defer]);
  return useContext(EnvironmentContext);
}
function EnvironmentProvider(props) {
  const { children, environment: environmentProp, disabled } = props;
  const ref = useRef(null);
  const context = useMemo(() => {
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
  return /* @__PURE__ */ jsxs(EnvironmentContext.Provider, { value: context, children: [
    children,
    showSpan && /* @__PURE__ */ jsx("span", { id: "__chakra_env", hidden: true, ref })
  ] });
}
EnvironmentProvider.displayName = "EnvironmentProvider";

export {
  useEnvironment,
  EnvironmentProvider
};
//# sourceMappingURL=chunk-VMD3UMGK.mjs.map