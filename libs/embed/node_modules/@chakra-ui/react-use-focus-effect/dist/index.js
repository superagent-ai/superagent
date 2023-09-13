'use client'
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useFocusOnHide: () => useFocusOnHide,
  useFocusOnShow: () => useFocusOnShow
});
module.exports = __toCommonJS(src_exports);
var import_dom_utils = require("@chakra-ui/dom-utils");
var import_react_use_event_listener = require("@chakra-ui/react-use-event-listener");
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react = require("react");
function preventReturnFocus(containerRef) {
  const el = containerRef.current;
  if (!el)
    return false;
  const activeElement = (0, import_dom_utils.getActiveElement)(el);
  if (!activeElement)
    return false;
  if (el.contains(activeElement))
    return false;
  if ((0, import_dom_utils.isTabbable)(activeElement))
    return true;
  return false;
}
function useFocusOnHide(containerRef, options) {
  const { shouldFocus: shouldFocusProp, visible, focusRef } = options;
  const shouldFocus = shouldFocusProp && !visible;
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    if (!shouldFocus)
      return;
    if (preventReturnFocus(containerRef)) {
      return;
    }
    const el = (focusRef == null ? void 0 : focusRef.current) || containerRef.current;
    let rafId;
    if (el) {
      rafId = requestAnimationFrame(() => {
        el.focus({ preventScroll: true });
      });
      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  }, [shouldFocus, containerRef, focusRef]);
}
var defaultOptions = {
  preventScroll: true,
  shouldFocus: false
};
function useFocusOnShow(target, options = defaultOptions) {
  const { focusRef, preventScroll, shouldFocus, visible } = options;
  const element = isRefObject(target) ? target.current : target;
  const autoFocusValue = shouldFocus && visible;
  const autoFocusRef = (0, import_react.useRef)(autoFocusValue);
  const lastVisibleRef = (0, import_react.useRef)(visible);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!lastVisibleRef.current && visible) {
      autoFocusRef.current = autoFocusValue;
    }
    lastVisibleRef.current = visible;
  }, [visible, autoFocusValue]);
  const onFocus = (0, import_react.useCallback)(() => {
    if (!visible || !element || !autoFocusRef.current)
      return;
    autoFocusRef.current = false;
    if (element.contains(document.activeElement))
      return;
    if (focusRef == null ? void 0 : focusRef.current) {
      requestAnimationFrame(() => {
        var _a;
        (_a = focusRef.current) == null ? void 0 : _a.focus({ preventScroll });
      });
    } else {
      const tabbableEls = (0, import_dom_utils.getAllFocusable)(element);
      if (tabbableEls.length > 0) {
        requestAnimationFrame(() => {
          tabbableEls[0].focus({ preventScroll });
        });
      }
    }
  }, [visible, preventScroll, element, focusRef]);
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    onFocus();
  }, [onFocus]);
  (0, import_react_use_event_listener.useEventListener)(element, "transitionend", onFocus);
}
function isRefObject(val) {
  return "current" in val;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFocusOnHide,
  useFocusOnShow
});
//# sourceMappingURL=index.js.map