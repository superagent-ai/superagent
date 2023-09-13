'use client'

// src/index.ts
import { useRef } from "react";
function useLatestRef(value) {
  const ref = useRef(null);
  ref.current = value;
  return ref;
}
export {
  useLatestRef
};
//# sourceMappingURL=index.mjs.map