'use client'

// src/use-event-listeners.ts
import { useCallback, useEffect, useRef } from "react";
function useEventListeners() {
  const listeners = useRef(/* @__PURE__ */ new Map());
  const currentListeners = listeners.current;
  const add = useCallback((el, type, listener, options) => {
    listeners.current.set(listener, { type, el, options });
    el.addEventListener(type, listener, options);
  }, []);
  const remove = useCallback(
    (el, type, listener, options) => {
      el.removeEventListener(type, listener, options);
      listeners.current.delete(listener);
    },
    []
  );
  useEffect(
    () => () => {
      currentListeners.forEach((value, key) => {
        remove(value.el, value.type, key, value.options);
      });
    },
    [remove, currentListeners]
  );
  return { add, remove };
}

export {
  useEventListeners
};
//# sourceMappingURL=chunk-VDSXRTOE.mjs.map