'use client'

// src/use-is-first-render.ts
import { useEffect, useRef } from "react";
function useIsFirstRender() {
  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);
  return isFirstRender.current;
}

export {
  useIsFirstRender
};
//# sourceMappingURL=chunk-AASO4CLC.mjs.map