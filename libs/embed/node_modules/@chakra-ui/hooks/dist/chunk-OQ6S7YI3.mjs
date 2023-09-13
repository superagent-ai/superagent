import {
  usePointerEvent
} from "./chunk-CF2OMLUG.mjs";
import {
  useUnmountEffect
} from "./chunk-3YZIECTS.mjs";

// src/use-pan-gesture.ts
import {
  noop,
  PanSession
} from "@chakra-ui/utils";
import { useEffect, useRef } from "react";
function usePanGesture(ref, props) {
  const {
    onPan,
    onPanStart,
    onPanEnd,
    onPanSessionStart,
    onPanSessionEnd,
    threshold
  } = props;
  const hasPanEvents = Boolean(
    onPan || onPanStart || onPanEnd || onPanSessionStart || onPanSessionEnd
  );
  const panSession = useRef(null);
  const handlers = {
    onSessionStart: onPanSessionStart,
    onSessionEnd: onPanSessionEnd,
    onStart: onPanStart,
    onMove: onPan,
    onEnd(event, info) {
      panSession.current = null;
      onPanEnd == null ? void 0 : onPanEnd(event, info);
    }
  };
  useEffect(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.updateHandlers(handlers);
  });
  function onPointerDown(event) {
    panSession.current = new PanSession(event, handlers, threshold);
  }
  usePointerEvent(
    () => ref.current,
    "pointerdown",
    hasPanEvents ? onPointerDown : noop
  );
  useUnmountEffect(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.end();
    panSession.current = null;
  });
}

export {
  usePanGesture
};
