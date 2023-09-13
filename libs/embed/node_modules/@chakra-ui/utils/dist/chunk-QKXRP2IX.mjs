import {
  isActiveElement,
  isInputElement
} from "./chunk-P6S57EDQ.mjs";
import {
  getOwnerDocument
} from "./chunk-O3SWHQEE.mjs";
import {
  warn
} from "./chunk-M3TFMUOL.mjs";

// src/focus.ts
function focus(element, options = {}) {
  const {
    isActive = isActiveElement,
    nextTick,
    preventScroll = true,
    selectTextIfInput = true
  } = options;
  if (!element || isActive(element))
    return -1;
  function triggerFocus() {
    if (!element) {
      warn({
        condition: true,
        message: "[chakra-ui]: can't call focus() on `null` or `undefined` element"
      });
      return;
    }
    if (supportsPreventScroll()) {
      element.focus({ preventScroll });
    } else {
      element.focus();
      if (preventScroll) {
        const scrollableElements = getScrollableElements(element);
        restoreScrollPosition(scrollableElements);
      }
    }
    if (selectTextIfInput) {
      if (isInputElement(element)) {
        element.select();
      } else if ("setSelectionRange" in element) {
        const el = element;
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }
  if (nextTick) {
    return requestAnimationFrame(triggerFocus);
  }
  triggerFocus();
  return -1;
}
var supportsPreventScrollCached = null;
function supportsPreventScroll() {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const div = document.createElement("div");
      div.focus({
        get preventScroll() {
          supportsPreventScrollCached = true;
          return true;
        }
      });
    } catch (e) {
    }
  }
  return supportsPreventScrollCached;
}
function getScrollableElements(element) {
  var _a;
  const doc = getOwnerDocument(element);
  const win = (_a = doc.defaultView) != null ? _a : window;
  let parent = element.parentNode;
  const scrollableElements = [];
  const rootScrollingElement = doc.scrollingElement || doc.documentElement;
  while (parent instanceof win.HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft
      });
    }
    parent = parent.parentNode;
  }
  if (rootScrollingElement instanceof win.HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft
    });
  }
  return scrollableElements;
}
function restoreScrollPosition(scrollableElements) {
  for (const { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}

export {
  focus
};
