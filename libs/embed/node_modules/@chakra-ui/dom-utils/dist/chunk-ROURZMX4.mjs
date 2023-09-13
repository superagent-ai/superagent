import {
  getOwnerDocument,
  isHTMLElement
} from "./chunk-3XANSPY5.mjs";

// src/tabbable.ts
var hasDisplayNone = (element) => window.getComputedStyle(element).display === "none";
var hasTabIndex = (element) => element.hasAttribute("tabindex");
var hasNegativeTabIndex = (element) => hasTabIndex(element) && element.tabIndex === -1;
function isDisabled(element) {
  return Boolean(element.getAttribute("disabled")) === true || Boolean(element.getAttribute("aria-disabled")) === true;
}
function isInputElement(element) {
  return isHTMLElement(element) && element.localName === "input" && "select" in element;
}
function isActiveElement(element) {
  const doc = isHTMLElement(element) ? getOwnerDocument(element) : document;
  return doc.activeElement === element;
}
function hasFocusWithin(element) {
  if (!document.activeElement)
    return false;
  return element.contains(document.activeElement);
}
function isHidden(element) {
  if (element.parentElement && isHidden(element.parentElement))
    return true;
  return element.hidden;
}
function isContentEditable(element) {
  const value = element.getAttribute("contenteditable");
  return value !== "false" && value != null;
}
function isFocusable(element) {
  if (!isHTMLElement(element) || isHidden(element) || isDisabled(element)) {
    return false;
  }
  const { localName } = element;
  const focusableTags = ["input", "select", "textarea", "button"];
  if (focusableTags.indexOf(localName) >= 0)
    return true;
  const others = {
    a: () => element.hasAttribute("href"),
    audio: () => element.hasAttribute("controls"),
    video: () => element.hasAttribute("controls")
  };
  if (localName in others) {
    return others[localName]();
  }
  if (isContentEditable(element))
    return true;
  return hasTabIndex(element);
}
function isTabbable(element) {
  if (!element)
    return false;
  return isHTMLElement(element) && isFocusable(element) && !hasNegativeTabIndex(element);
}

export {
  hasDisplayNone,
  hasTabIndex,
  hasNegativeTabIndex,
  isDisabled,
  isInputElement,
  isActiveElement,
  hasFocusWithin,
  isHidden,
  isContentEditable,
  isFocusable,
  isTabbable
};
