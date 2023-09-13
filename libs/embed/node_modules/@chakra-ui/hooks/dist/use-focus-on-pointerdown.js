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

// src/use-focus-on-pointerdown.ts
var use_focus_on_pointerdown_exports = {};
__export(use_focus_on_pointerdown_exports, {
  useFocusOnPointerDown: () => useFocusOnPointerDown
});
module.exports = __toCommonJS(use_focus_on_pointerdown_exports);
var import_utils4 = require("@chakra-ui/utils");

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

// src/use-focus-on-pointerdown.ts
function useFocusOnPointerDown(props) {
  const { ref, elements, enabled } = props;
  const isSafari = (0, import_utils4.detectBrowser)("Safari");
  const doc = () => (0, import_utils4.getOwnerDocument)(ref.current);
  usePointerEvent(doc, "pointerdown", (event) => {
    if (!isSafari || !enabled)
      return;
    const target = event.target;
    const els = elements != null ? elements : [ref];
    const isValidTarget = els.some((elementOrRef) => {
      const el = (0, import_utils4.isRefObject)(elementOrRef) ? elementOrRef.current : elementOrRef;
      return (0, import_utils4.contains)(el, target);
    });
    if (!(0, import_utils4.isActiveElement)(target) && isValidTarget) {
      event.preventDefault();
      (0, import_utils4.focus)(target);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFocusOnPointerDown
});
