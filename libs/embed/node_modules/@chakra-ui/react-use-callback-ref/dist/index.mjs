'use client'

// src/index.ts
import { useCallback, useEffect, useRef } from "react";
function useCallbackRef(callback, deps = []) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args) => {
    var _a;
    return (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, ...args);
  }, deps);
}
export {
  useCallbackRef
};
//# sourceMappingURL=index.mjs.map