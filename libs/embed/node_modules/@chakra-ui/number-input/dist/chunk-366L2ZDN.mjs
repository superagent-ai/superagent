'use client'

// src/use-spinner.ts
import { useInterval } from "@chakra-ui/react-use-interval";
import { useCallback, useEffect, useRef, useState } from "react";
var CONTINUOUS_CHANGE_INTERVAL = 50;
var CONTINUOUS_CHANGE_DELAY = 300;
function useSpinner(increment, decrement) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [action, setAction] = useState(null);
  const [runOnce, setRunOnce] = useState(true);
  const timeoutRef = useRef(null);
  const removeTimeout = () => clearTimeout(timeoutRef.current);
  useInterval(
    () => {
      if (action === "increment") {
        increment();
      }
      if (action === "decrement") {
        decrement();
      }
    },
    isSpinning ? CONTINUOUS_CHANGE_INTERVAL : null
  );
  const up = useCallback(() => {
    if (runOnce) {
      increment();
    }
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction("increment");
    }, CONTINUOUS_CHANGE_DELAY);
  }, [increment, runOnce]);
  const down = useCallback(() => {
    if (runOnce) {
      decrement();
    }
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction("decrement");
    }, CONTINUOUS_CHANGE_DELAY);
  }, [decrement, runOnce]);
  const stop = useCallback(() => {
    setRunOnce(true);
    setIsSpinning(false);
    removeTimeout();
  }, []);
  useEffect(() => {
    return () => removeTimeout();
  }, []);
  return { up, down, stop, isSpinning };
}

export {
  useSpinner
};
//# sourceMappingURL=chunk-366L2ZDN.mjs.map