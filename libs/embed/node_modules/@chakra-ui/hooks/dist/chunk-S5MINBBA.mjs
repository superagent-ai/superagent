import {
  useUpdateEffect
} from "./chunk-5AOLTBA4.mjs";
import {
  useEventListener
} from "./chunk-34PRFZWK.mjs";
import {
  useSafeLayoutEffect
} from "./chunk-IYF65QR3.mjs";

// src/use-focus-on-show.ts
import {
  contains,
  focus,
  getAllFocusable,
  isRefObject
} from "@chakra-ui/utils";
import { useCallback, useRef } from "react";
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
    if (contains(element, document.activeElement))
      return;
    if (focusRef == null ? void 0 : focusRef.current) {
      focus(focusRef.current, { preventScroll, nextTick: true });
    } else {
      const tabbableEls = getAllFocusable(element);
      if (tabbableEls.length > 0) {
        focus(tabbableEls[0], { preventScroll, nextTick: true });
      }
    }
  }, [visible, preventScroll, element, focusRef]);
  useUpdateEffect(() => {
    onFocus();
  }, [onFocus]);
  useEventListener("transitionend", onFocus, element);
}

export {
  useFocusOnShow
};
