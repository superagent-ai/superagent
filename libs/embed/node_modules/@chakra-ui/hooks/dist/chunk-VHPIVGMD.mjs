import {
  useCallbackRef
} from "./chunk-TFWETJDV.mjs";

// src/use-interval.ts
import { useEffect } from "react";
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
