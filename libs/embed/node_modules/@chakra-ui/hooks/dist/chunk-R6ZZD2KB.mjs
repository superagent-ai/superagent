// src/use-latest-ref.ts
import { useRef } from "react";
function useLatestRef(value) {
  const ref = useRef(null);
  ref.current = value;
  return ref;
}

export {
  useLatestRef
};
