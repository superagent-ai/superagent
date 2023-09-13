'use client'

// src/index.ts
import { useEffect } from "react";
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
function useEventListener(target, event, handler, options) {
  const listener = useCallbackRef(handler);
  useEffect(() => {
    const node = typeof target === "function" ? target() : target != null ? target : document;
    if (!handler || !node)
      return;
    node.addEventListener(event, listener, options);
    return () => {
      node.removeEventListener(event, listener, options);
    };
  }, [event, target, options, listener, handler]);
  return () => {
    const node = typeof target === "function" ? target() : target != null ? target : document;
    node == null ? void 0 : node.removeEventListener(event, listener, options);
  };
}
export {
  useEventListener
};
//# sourceMappingURL=index.mjs.map