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

// src/use-event-listener-map.ts
var use_event_listener_map_exports = {};
__export(use_event_listener_map_exports, {
  useEventListenerMap: () => useEventListenerMap
});
module.exports = __toCommonJS(use_event_listener_map_exports);
var import_utils = require("@chakra-ui/utils");
var import_react = require("react");
function useEventListenerMap() {
  const listeners = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const currentListeners = listeners.current;
  const add = (0, import_react.useCallback)((el, type, listener, options) => {
    const pointerEventListener = (0, import_utils.wrapPointerEventHandler)(
      listener,
      type === "pointerdown"
    );
    listeners.current.set(listener, {
      __listener: pointerEventListener,
      type: (0, import_utils.getPointerEventName)(type),
      el,
      options
    });
    el.addEventListener(type, pointerEventListener, options);
  }, []);
  const remove = (0, import_react.useCallback)(
    (el, type, listener, options) => {
      const { __listener: pointerEventListener } = listeners.current.get(listener);
      el.removeEventListener(type, pointerEventListener, options);
      listeners.current.delete(pointerEventListener);
    },
    []
  );
  (0, import_react.useEffect)(
    () => () => {
      currentListeners.forEach((value, key) => {
        remove(value.el, value.type, key, value.options);
      });
    },
    [remove, currentListeners]
  );
  return { add, remove };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEventListenerMap
});
