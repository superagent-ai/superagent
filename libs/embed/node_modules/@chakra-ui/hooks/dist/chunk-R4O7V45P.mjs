// src/use-previous.ts
import { useRef, useEffect } from "react";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export {
  usePrevious
};
