// src/use-unmount-effect.ts
import { useEffect } from "react";
function useUnmountEffect(fn, deps = []) {
  return useEffect(
    () => () => fn(),
    deps
  );
}

export {
  useUnmountEffect
};
