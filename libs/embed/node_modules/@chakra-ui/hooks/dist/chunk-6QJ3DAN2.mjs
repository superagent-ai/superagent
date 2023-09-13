// src/use-event-listener-map.ts
import {
  getPointerEventName,
  wrapPointerEventHandler
} from "@chakra-ui/utils";
import { useCallback, useEffect, useRef } from "react";
function useEventListenerMap() {
  const listeners = useRef(/* @__PURE__ */ new Map());
  const currentListeners = listeners.current;
  const add = useCallback((el, type, listener, options) => {
    const pointerEventListener = wrapPointerEventHandler(
      listener,
      type === "pointerdown"
    );
    listeners.current.set(listener, {
      __listener: pointerEventListener,
      type: getPointerEventName(type),
      el,
      options
    });
    el.addEventListener(type, pointerEventListener, options);
  }, []);
  const remove = useCallback(
    (el, type, listener, options) => {
      const { __listener: pointerEventListener } = listeners.current.get(listener);
      el.removeEventListener(type, pointerEventListener, options);
      listeners.current.delete(pointerEventListener);
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
  useEventListenerMap
};
