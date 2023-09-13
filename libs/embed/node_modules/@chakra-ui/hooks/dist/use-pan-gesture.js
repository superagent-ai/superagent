"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-pan-gesture.ts
var use_pan_gesture_exports = {};
__export(use_pan_gesture_exports, {
  usePanGesture: () => usePanGesture
});
module.exports = __toCommonJS(use_pan_gesture_exports);
var import_utils4 = require("@chakra-ui/utils");
var import_react5 = require("react");

// src/use-pointer-event.ts
var import_utils3 = require("@chakra-ui/utils");

// src/use-event-listener.ts
var import_utils2 = require("@chakra-ui/utils");
var import_react3 = require("react");

// src/use-callback-ref.ts
var import_react2 = require("react");

// src/use-safe-layout-effect.ts
var import_utils = require("@chakra-ui/utils");
var import_react = require("react");
var useSafeLayoutEffect = import_utils.isBrowser ? import_react.useLayoutEffect : import_react.useEffect;

// src/use-callback-ref.ts
function useCallbackRef(fn, deps = []) {
  const ref = (0, import_react2.useRef)(fn);
  useSafeLayoutEffect(() => {
    ref.current = fn;
  });
  return (0, import_react2.useCallback)((...args) => {
    var _a;
    return (_a = ref.current) == null ? void 0 : _a.call(ref, ...args);
  }, deps);
}

// src/use-event-listener.ts
function useEventListener(event, handler, env, options) {
  const listener = useCallbackRef(handler);
  (0, import_react3.useEffect)(() => {
    var _a;
    const node = (_a = (0, import_utils2.runIfFn)(env)) != null ? _a : document;
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
    const node = (_a = (0, import_utils2.runIfFn)(env)) != null ? _a : document;
    node.removeEventListener(event, listener, options);
  };
}

// src/use-pointer-event.ts
function usePointerEvent(env, eventName, handler, options) {
  return useEventListener(
    (0, import_utils3.getPointerEventName)(eventName),
    (0, import_utils3.wrapPointerEventHandler)(handler, eventName === "pointerdown"),
    env,
    options
  );
}

// src/use-unmount-effect.ts
var import_react4 = require("react");
function useUnmountEffect(fn, deps = []) {
  return (0, import_react4.useEffect)(
    () => () => fn(),
    deps
  );
}

// src/use-pan-gesture.ts
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
  const panSession = (0, import_react5.useRef)(null);
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
  (0, import_react5.useEffect)(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.updateHandlers(handlers);
  });
  function onPointerDown(event) {
    panSession.current = new import_utils4.PanSession(event, handlers, threshold);
  }
  usePointerEvent(
    () => ref.current,
    "pointerdown",
    hasPanEvents ? onPointerDown : import_utils4.noop
  );
  useUnmountEffect(() => {
    var _a;
    (_a = panSession.current) == null ? void 0 : _a.end();
    panSession.current = null;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePanGesture
});
