'use client'
import {
  PanEvent
} from "./chunk-Z2LY7B4S.mjs";

// src/use-pan-event.ts
import { addPointerEvent } from "@chakra-ui/event-utils";
import { useLatestRef } from "@chakra-ui/react-use-latest-ref";
import { useEffect, useRef } from "react";
function usePanEvent(ref, options) {
  const {
    onPan,
    onPanStart,
    onPanEnd,
    onPanSessionStart,
    onPanSessionEnd,
    threshold
  } = options;
  const hasPanEvents = Boolean(
    onPan || onPanStart || onPanEnd || onPanSessionStart || onPanSessionEnd
  );
  const panSession = useRef(null);
  const handlersRef = useLatestRef({
    onSessionStart: onPanSessionStart,
    onSessionEnd: onPanSessionEnd,
    onStart: onPanStart,
    onMove: onPan,
    onEnd(event, info) {
      panSession.current = null;
      onPanEnd == null ? void 0 : onPanEnd(event, info);
    }
  });
  useEffect(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.updateHandlers(handlersRef.current);
  });
  useEffect(() => {
    const node = ref.current;
    if (!node || !hasPanEvents)
      return;
    function onPointerDown(event) {
      panSession.current = new PanEvent(event, handlersRef.current, threshold);
    }
    return addPointerEvent(node, "pointerdown", onPointerDown);
  }, [ref, hasPanEvents, handlersRef, threshold]);
  useEffect(() => {
    return () => {
      var _a;
      (_a = panSession.current) == null ? void 0 : _a.end();
      panSession.current = null;
    };
  }, []);
}

export {
  usePanEvent
};
//# sourceMappingURL=chunk-AQIKOOGA.mjs.map