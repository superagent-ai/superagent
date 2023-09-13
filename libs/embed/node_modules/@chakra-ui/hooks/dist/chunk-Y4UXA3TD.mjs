// src/use-const.ts
import { useRef } from "react";
function useConst(init) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = typeof init === "function" ? init() : init;
  }
  return ref.current;
}

export {
  useConst
};
