import {
  useUpdateEffect
} from "./chunk-5AOLTBA4.mjs";

// src/use-focus-on-hide.ts
import {
  contains,
  focus,
  getActiveElement,
  isTabbable
} from "@chakra-ui/utils";
function preventReturnFocus(containerRef) {
  const el = containerRef.current;
  if (!el)
    return false;
  const activeElement = getActiveElement(el);
  if (!activeElement)
    return false;
  if (contains(el, activeElement))
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
    if (el) {
      focus(el, { nextTick: true });
    }
  }, [shouldFocus, containerRef, focusRef]);
}

export {
  useFocusOnHide
};
