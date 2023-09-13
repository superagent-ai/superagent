import {
  useUnmountEffect
} from "./chunk-3YZIECTS.mjs";

// src/use-force-update.ts
import { useCallback, useRef, useState } from "react";
function useForceUpdate() {
  const unloadingRef = useRef(false);
  const [count, setCount] = useState(0);
  useUnmountEffect(() => {
    unloadingRef.current = true;
  });
  return useCallback(() => {
    if (!unloadingRef.current) {
      setCount(count + 1);
    }
  }, [count]);
}

export {
  useForceUpdate
};
