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

// src/tabbable.ts
var tabbable_exports = {};
__export(tabbable_exports, {
  hasDisplayNone: () => hasDisplayNone,
  hasFocusWithin: () => hasFocusWithin,
  hasNegativeTabIndex: () => hasNegativeTabIndex,
  hasTabIndex: () => hasTabIndex,
  isActiveElement: () => isActiveElement,
  isContentEditable: () => isContentEditable,
  isDisabled: () => isDisabled,
  isFocusable: () => isFocusable,
  isHidden: () => isHidden,
  isInputElement: () => isInputElement,
  isTabbable: () => isTabbable
});
module.exports = __toCommonJS(tabbable_exports);

// src/dom.ts
function isElement(el) {
  return el != null && typeof el == "object" && "nodeType" in el && el.nodeType === Node.ELEMENT_NODE;
}
function isHTMLElement(el) {
  var _a;
  if (!isElement(el)) {
    return false;
  }
  const win = (_a = el.ownerDocument.defaultView) != null ? _a : window;
  return el instanceof win.HTMLElement;
}
function getOwnerDocument(node) {
  var _a;
  return isElement(node) ? (_a = node.ownerDocument) != null ? _a : document : document;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
