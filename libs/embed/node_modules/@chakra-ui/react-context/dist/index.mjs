'use client'

// src/index.ts
import {
  createContext as createReactContext,
  useContext as useReactContext
} from "react";
function getErrorMessage(hook, provider) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`;
}
function createContext(options = {}) {
  const {
    name,
    strict = true,
    hookName = "useContext",
    providerName = "Provider",
    errorMessage,
    defaultValue
  } = options;
  const Context = createReactContext(defaultValue);
  Context.displayName = name;
  function useContext() {
    var _a;
    const context = useReactContext(Context);
    if (!context && strict) {
      const error = new Error(
        errorMessage != null ? errorMessage : getErrorMessage(hookName, providerName)
      );
      error.name = "ContextError";
      (_a = Error.captureStackTrace) == null ? void 0 : _a.call(Error, error, useContext);
      throw error;
    }
    return context;
  }
  return [Context.Provider, useContext, Context];
}
export {
  createContext
};
//# sourceMappingURL=index.mjs.map