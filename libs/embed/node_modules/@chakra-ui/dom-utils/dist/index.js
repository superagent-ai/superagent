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
  contains: () => contains,
  getActiveElement: () => getActiveElement,
  getAllFocusable: () => getAllFocusable,
  getAllTabbable: () => getAllTabbable,
  getEventWindow: () => getEventWindow,
  getFirstFocusable: () => getFirstFocusable,
  getFirstTabbableIn: () => getFirstTabbableIn,
  getLastTabbableIn: () => getLastTabbableIn,
  getNextTabbable: () => getNextTabbable,
  getOwnerDocument: () => getOwnerDocument,
  getOwnerWindow: () => getOwnerWindow,
  getPreviousTabbable: () => getPreviousTabbable,
  getScrollParent: () => getScrollParent,
  hasDisplayNone: () => hasDisplayNone,
  hasFocusWithin: () => hasFocusWithin,
  hasNegativeTabIndex: () => hasNegativeTabIndex,
  hasTabIndex: () => hasTabIndex,
  isActiveElement: () => isActiveElement,
  isBrowser: () => isBrowser,
  isContentEditable: () => isContentEditable,
  isDisabled: () => isDisabled,
  isElement: () => isElement,
  isFocusable: () => isFocusable,
  isHTMLElement: () => isHTMLElement,
  isHidden: () => isHidden,
  isInputElement: () => isInputElement,
  isTabbable: () => isTabbable
});
module.exports = __toCommonJS(src_exports);

// src/dom.ts
function isElement(el) {
  return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
}
function isHTMLElement(el) {
  var _a;
  if (!isElement(el))
    return false;
  const win = (_a = el.ownerDocument.defaultView) != null ? _a : window;
  return el instanceof win.HTMLElement;
}
function getOwnerWindow(node) {
  var _a, _b;
  return (_b = (_a = getOwnerDocument(node)) == null ? void 0 : _a.defaultView) != null ? _b : window;
}
function getOwnerDocument(node) {
  return isElement(node) ? node.ownerDocument : document;
}
function getEventWindow(event) {
  var _a;
  return (_a = event.view) != null ? _a : window;
}
function isBrowser() {
  return Boolean(globalThis == null ? void 0 : globalThis.document);
}
function getActiveElement(node) {
  return getOwnerDocument(node).activeElement;
}
function contains(parent, child) {
  if (!parent)
    return false;
  return parent === child || parent.contains(child);
}

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

// src/scroll.ts
function isScrollParent(el) {
  const win = el.ownerDocument.defaultView || window;
  const { overflow, overflowX, overflowY } = win.getComputedStyle(el);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getParent(el) {
  if (el.localName === "html")
    return el;
  return el.assignedSlot || el.parentElement || el.ownerDocument.documentElement;
}
function getScrollParent(el) {
  if (["html", "body", "#document"].includes(el.localName)) {
    return el.ownerDocument.body;
  }
  if (isHTMLElement(el) && isScrollParent(el)) {
    return el;
  }
  return getScrollParent(getParent(el));
}

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
