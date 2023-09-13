'use client'

// src/index.ts
import { useEffect } from "react";
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
function useTimeout(callback, delay) {
  const fn = useCallbackRef(callback);
  useEffect(() => {
    if (delay == null)
      return void 0;
    let timeoutId = null;
    timeoutId = window.setTimeout(() => {
      fn();
    }, delay);
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delay, fn]);
}
export {
  useTimeout
};
//# sourceMappingURL=index.mjs.map