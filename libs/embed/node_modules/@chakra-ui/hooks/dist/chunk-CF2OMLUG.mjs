import {
  useEventListener
} from "./chunk-34PRFZWK.mjs";

// src/use-pointer-event.ts
import {
  getPointerEventName,
  wrapPointerEventHandler
} from "@chakra-ui/utils";
function usePointerEvent(env, eventName, handler, options) {
  return useEventListener(
    getPointerEventName(eventName),
    wrapPointerEventHandler(handler, eventName === "pointerdown"),
    env,
    options
  );
}

export {
  usePointerEvent
};
