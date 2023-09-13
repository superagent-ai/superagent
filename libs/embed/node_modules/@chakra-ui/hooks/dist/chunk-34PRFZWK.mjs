import {
  useCallbackRef
} from "./chunk-TFWETJDV.mjs";

// src/use-event-listener.ts
import { runIfFn } from "@chakra-ui/utils";
import { useEffect } from "react";
function useEventListener(event, handler, env, options) {
  const listener = useCallbackRef(handler);
  useEffect(() => {
    var _a;
    const node = (_a = runIfFn(env)) != null ? _a : document;
    if (!handler) {
      return;
    }
    node.addEventListener(event, listener, options);
    return () => {
      node.removeEventListener(event, listener, options);
    };
  }, [event, env, options, listener, handler]);
  return () => {
    var _a;
    const node = (_a = runIfFn(env)) != null ? _a : document;
    node.removeEventListener(event, listener, options);
  };
}

export {
  useEventListener
};
