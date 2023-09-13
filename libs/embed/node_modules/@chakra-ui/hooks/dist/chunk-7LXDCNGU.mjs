import {
  useCallbackRef
} from "./chunk-TFWETJDV.mjs";

// src/use-timeout.ts
import { useEffect } from "react";
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
