import {
  isFocusable,
  isTabbable
} from "./chunk-P6S57EDQ.mjs";
import {
  isHTMLElement
} from "./chunk-O3SWHQEE.mjs";

// src/dom-query.ts
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
function focusNextTabbable(container, fallbackToFocusable) {
  const nextTabbable = getNextTabbable(container, fallbackToFocusable);
  if (nextTabbable && isHTMLElement(nextTabbable)) {
    nextTabbable.focus();
  }
}
function focusPreviousTabbable(container, fallbackToFocusable) {
  const previousTabbable = getPreviousTabbable(container, fallbackToFocusable);
  if (previousTabbable && isHTMLElement(previousTabbable)) {
    previousTabbable.focus();
  }
}
function matches(element, selectors) {
  if ("matches" in element)
    return element.matches(selectors);
  if ("msMatchesSelector" in element)
    return element.msMatchesSelector(selectors);
  return element.webkitMatchesSelector(selectors);
}
function closest(element, selectors) {
  if ("closest" in element)
    return element.closest(selectors);
  do {
    if (matches(element, selectors))
      return element;
    element = element.parentElement || element.parentNode;
  } while (element !== null && element.nodeType === 1);
  return null;
}

export {
  getAllFocusable,
  getFirstFocusable,
  getAllTabbable,
  getFirstTabbableIn,
  getLastTabbableIn,
  getNextTabbable,
  getPreviousTabbable,
  focusNextTabbable,
  focusPreviousTabbable,
  closest
};
