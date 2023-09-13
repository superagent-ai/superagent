'use client'

// src/index.ts
import { useEffect, useRef } from "react";
function useUpdateEffect(callback, deps) {
  const renderCycleRef = useRef(false);
  const effectCycleRef = useRef(false);
  useEffect(() => {
    const mounted = renderCycleRef.current;
    const run = mounted && effectCycleRef.current;
    if (run) {
      return callback();
    }
    effectCycleRef.current = true;
  }, deps);
  useEffect(() => {
    renderCycleRef.current = true;
    return () => {
      renderCycleRef.current = false;
    };
  }, []);
}
export {
  useUpdateEffect
};
//# sourceMappingURL=index.mjs.map