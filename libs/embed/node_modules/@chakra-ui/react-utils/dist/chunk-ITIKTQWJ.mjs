// src/context.ts
import {
  createContext as createReactContext,
  useContext as useReactContext
} from "react";
function createContext(options = {}) {
  const {
    strict = true,
    errorMessage = "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",
    name
  } = options;
  const Context = createReactContext(void 0);
  Context.displayName = name;
  function useContext() {
    var _a;
    const context = useReactContext(Context);
    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = "ContextError";
      (_a = Error.captureStackTrace) == null ? void 0 : _a.call(Error, error, useContext);
      throw error;
    }
    return context;
  }
  return [
    Context.Provider,
    useContext,
    Context
  ];
}

export {
  createContext
};
