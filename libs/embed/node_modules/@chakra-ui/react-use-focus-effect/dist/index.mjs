'use client'

// src/index.ts
import {
  getActiveElement,
  getAllFocusable,
  isTabbable
} from "@chakra-ui/dom-utils";
import { useEventListener } from "@chakra-ui/react-use-event-listener";
import { useSafeLayoutEffect } from "@chakra-ui/react-use-safe-layout-effect";
import { useUpdateEffect } from "@chakra-ui/react-use-update-effect";
import { useCallback, useRef } from "react";
function preventReturnFocus(containerRef) {
  const el = containerRef.current;
  if (!el)
    return false;
  const activeElement = getActiveElement(el);
  if (!activeElement)
    return false;
  if (el.contains(activeElement))
    return false;
  if (isTabbable(activeElement))
    return true;
  return false;
}
function useFocusOnHide(containerRef, options) {
  const { shouldFocus: shouldFocusProp, visible, focusRef } = options;
  const shouldFocus = shouldFocusProp && !visible;
  useUpdateEffect(() => {
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
  const autoFocusRef = useRef(autoFocusValue);
  const lastVisibleRef = useRef(visible);
  useSafeLayoutEffect(() => {
    if (!lastVisibleRef.current && visible) {
      autoFocusRef.current = autoFocusValue;
    }
    lastVisibleRef.current = visible;
  }, [visible, autoFocusValue]);
  const onFocus = useCallback(() => {
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
      const tabbableEls = getAllFocusable(element);
      if (tabbableEls.length > 0) {
        requestAnimationFrame(() => {
          tabbableEls[0].focus({ preventScroll });
        });
      }
    }
  }, [visible, preventScroll, element, focusRef]);
  useUpdateEffect(() => {
    onFocus();
  }, [onFocus]);
  useEventListener(element, "transitionend", onFocus);
}
function isRefObject(val) {
  return "current" in val;
}
export {
  useFocusOnHide,
  useFocusOnShow
};
//# sourceMappingURL=index.mjs.map