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

// src/use-focus-on-show.ts
var use_focus_on_show_exports = {};
__export(use_focus_on_show_exports, {
  useFocusOnShow: () => useFocusOnShow
});
module.exports = __toCommonJS(use_focus_on_show_exports);
var import_utils3 = require("@chakra-ui/utils");
var import_react5 = require("react");

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

// src/use-update-effect.ts
var import_react4 = require("react");
var useUpdateEffect = (effect, deps) => {
  const renderCycleRef = (0, import_react4.useRef)(false);
  const effectCycleRef = (0, import_react4.useRef)(false);
  (0, import_react4.useEffect)(() => {
    const isMounted = renderCycleRef.current;
    const shouldRun = isMounted && effectCycleRef.current;
    if (shouldRun) {
      return effect();
    }
    effectCycleRef.current = true;
  }, deps);
  (0, import_react4.useEffect)(() => {
    renderCycleRef.current = true;
    return () => {
      renderCycleRef.current = false;
    };
  }, []);
};

// src/use-focus-on-show.ts
var defaultOptions = {
  preventScroll: true,
  shouldFocus: false
};
function useFocusOnShow(target, options = defaultOptions) {
  const { focusRef, preventScroll, shouldFocus, visible } = options;
  const element = (0, import_utils3.isRefObject)(target) ? target.current : target;
  const autoFocusValue = shouldFocus && visible;
  const autoFocusRef = (0, import_react5.useRef)(autoFocusValue);
  const lastVisibleRef = (0, import_react5.useRef)(visible);
  useSafeLayoutEffect(() => {
    if (!lastVisibleRef.current && visible) {
      autoFocusRef.current = autoFocusValue;
    }
    lastVisibleRef.current = visible;
  }, [visible, autoFocusValue]);
  const onFocus = (0, import_react5.useCallback)(() => {
    if (!visible || !element || !autoFocusRef.current)
      return;
    autoFocusRef.current = false;
    if ((0, import_utils3.contains)(element, document.activeElement))
      return;
    if (focusRef == null ? void 0 : focusRef.current) {
      (0, import_utils3.focus)(focusRef.current, { preventScroll, nextTick: true });
    } else {
      const tabbableEls = (0, import_utils3.getAllFocusable)(element);
      if (tabbableEls.length > 0) {
        (0, import_utils3.focus)(tabbableEls[0], { preventScroll, nextTick: true });
      }
    }
  }, [visible, preventScroll, element, focusRef]);
  useUpdateEffect(() => {
    onFocus();
  }, [onFocus]);
  useEventListener("transitionend", onFocus, element);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFocusOnShow
});
