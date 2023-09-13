'use client'

// src/index.ts
import { useEffect } from "react";
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
function useInterval(callback, delay) {
  const fn = useCallbackRef(callback);
  useEffect(() => {
    let intervalId = null;
    const tick = () => fn();
    if (delay !== null) {
      intervalId = window.setInterval(tick, delay);
    }
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [delay, fn]);
}
export {
  useInterval
};
//# sourceMappingURL=index.mjs.map