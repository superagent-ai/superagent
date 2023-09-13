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

// src/use-animation-state.ts
var use_animation_state_exports = {};
__export(use_animation_state_exports, {
  useAnimationState: () => useAnimationState
});
module.exports = __toCommonJS(use_animation_state_exports);
var import_utils3 = require("@chakra-ui/utils");
var import_react4 = require("react");

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

// src/use-animation-state.ts
function useAnimationState(props) {
  const { isOpen, ref } = props;
  const [mounted, setMounted] = (0, import_react4.useState)(isOpen);
  const [once, setOnce] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    if (!once) {
      setMounted(isOpen);
      setOnce(true);
    }
  }, [isOpen, once, mounted]);
  useEventListener(
    "animationend",
    () => {
      setMounted(isOpen);
    },
    () => ref.current
  );
  const hidden = isOpen ? false : !mounted;
  return {
    present: !hidden,
    onComplete() {
      var _a;
      const win = (0, import_utils3.getOwnerWindow)(ref.current);
      const evt = new win.CustomEvent("animationend", { bubbles: true });
      (_a = ref.current) == null ? void 0 : _a.dispatchEvent(evt);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAnimationState
});
