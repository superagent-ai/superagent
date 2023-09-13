import {
  getScrollParent
} from "./chunk-4WEUWBTD.mjs";
import {
  hasDisplayNone,
  hasFocusWithin,
  hasNegativeTabIndex,
  hasTabIndex,
  isActiveElement,
  isContentEditable,
  isDisabled,
  isFocusable,
  isHidden,
  isInputElement,
  isTabbable
} from "./chunk-ROURZMX4.mjs";
import {
  contains,
  getActiveElement,
  getEventWindow,
  getOwnerDocument,
  getOwnerWindow,
  isBrowser,
  isElement,
  isHTMLElement
} from "./chunk-3XANSPY5.mjs";

// src/index.ts
var focusableElList = [
  "input:not(:disabled):not([disabled])",
  "select:not(:disabled):not([disabled])",
  "textarea:not(:disabled):not([disabled])",
  "embed",
  "iframe",
  "object",
  "a[href]",
  "area[href]",
  "button:not(:disabled):not([disabled])",
  "[tabindex]",
  "audio[controls]",
  "video[controls]",
  "*[tabindex]:not([aria-disabled])",
  "*[contenteditable]"
];
var focusableElSelector = focusableElList.join();
var isVisible = (el) => el.offsetWidth > 0 && el.offsetHeight > 0;
function getAllFocusable(container) {
  const focusableEls = Array.from(
    container.querySelectorAll(focusableElSelector)
  );
  focusableEls.unshift(container);
  return focusableEls.filter((el) => isFocusable(el) && isVisible(el));
}
function getFirstFocusable(container) {
  const allFocusable = getAllFocusable(container);
  return allFocusable.length ? allFocusable[0] : null;
}
function getAllTabbable(container, fallbackToFocusable) {
  const allFocusable = Array.from(
    container.querySelectorAll(focusableElSelector)
  );
  const allTabbable = allFocusable.filter(isTabbable);
  if (isTabbable(container)) {
    allTabbable.unshift(container);
  }
  if (!allTabbable.length && fallbackToFocusable) {
    return allFocusable;
  }
  return allTabbable;
}
function getFirstTabbableIn(container, fallbackToFocusable) {
  const [first] = getAllTabbable(container, fallbackToFocusable);
  return first || null;
}
function getLastTabbableIn(container, fallbackToFocusable) {
  const allTabbable = getAllTabbable(container, fallbackToFocusable);
  return allTabbable[allTabbable.length - 1] || null;
}
function getNextTabbable(container, fallbackToFocusable) {
  const allFocusable = getAllFocusable(container);
  const index = allFocusable.indexOf(document.activeElement);
  const slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
function getPreviousTabbable(container, fallbackToFocusable) {
  const allFocusable = getAllFocusable(container).reverse();
  const index = allFocusable.indexOf(document.activeElement);
  const slice = allFocusable.slice(index + 1);
  return slice.find(isTabbable) || allFocusable.find(isTabbable) || (fallbackToFocusable ? slice[0] : null);
}
export {
  contains,
  getActiveElement,
  getAllFocusable,
  getAllTabbable,
  getEventWindow,
  getFirstFocusable,
  getFirstTabbableIn,
  getLastTabbableIn,
  getNextTabbable,
  getOwnerDocument,
  getOwnerWindow,
  getPreviousTabbable,
  getScrollParent,
  hasDisplayNone,
  hasFocusWithin,
  hasNegativeTabIndex,
  hasTabIndex,
  isActiveElement,
  isBrowser,
  isContentEditable,
  isDisabled,
  isElement,
  isFocusable,
  isHTMLElement,
  isHidden,
  isInputElement,
  isTabbable
};
