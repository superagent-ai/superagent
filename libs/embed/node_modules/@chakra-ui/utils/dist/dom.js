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

// src/dom.ts
var dom_exports = {};
__export(dom_exports, {
  addDomEvent: () => addDomEvent,
  ariaAttr: () => ariaAttr,
  canUseDOM: () => canUseDOM,
  contains: () => contains,
  cx: () => cx,
  dataAttr: () => dataAttr,
  getActiveElement: () => getActiveElement,
  getEventWindow: () => getEventWindow,
  getOwnerDocument: () => getOwnerDocument,
  getOwnerWindow: () => getOwnerWindow,
  getRelatedTarget: () => getRelatedTarget,
  isBrowser: () => isBrowser,
  isElement: () => isElement,
  isHTMLElement: () => isHTMLElement,
  isRightClick: () => isRightClick,
  normalizeEventKey: () => normalizeEventKey
});
module.exports = __toCommonJS(dom_exports);
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
function getOwnerWindow(node) {
  var _a, _b;
  return isElement(node) ? (_b = (_a = getOwnerDocument(node)) == null ? void 0 : _a.defaultView) != null ? _b : window : window;
}
function getOwnerDocument(node) {
  var _a;
  return isElement(node) ? (_a = node.ownerDocument) != null ? _a : document : document;
}
function getEventWindow(event) {
  var _a;
  return (_a = event.view) != null ? _a : window;
}
function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
var isBrowser = /* @__PURE__ */ canUseDOM();
var dataAttr = (condition) => condition ? "" : void 0;
var ariaAttr = (condition) => condition ? true : void 0;
var cx = (...classNames) => classNames.filter(Boolean).join(" ");
function getActiveElement(node) {
  const doc = getOwnerDocument(node);
  return doc == null ? void 0 : doc.activeElement;
}
function contains(parent, child) {
  if (!parent)
    return false;
  return parent === child || parent.contains(child);
}
function addDomEvent(target, eventName, handler, options) {
  target.addEventListener(eventName, handler, options);
  return () => {
    target.removeEventListener(eventName, handler, options);
  };
}
function normalizeEventKey(event) {
  const { key, keyCode } = event;
  const isArrowKey = keyCode >= 37 && keyCode <= 40 && key.indexOf("Arrow") !== 0;
  const eventKey = isArrowKey ? `Arrow${key}` : key;
  return eventKey;
}
function getRelatedTarget(event) {
  var _a, _b;
  const target = (_a = event.target) != null ? _a : event.currentTarget;
  const activeElement = getActiveElement(target);
  return (_b = event.relatedTarget) != null ? _b : activeElement;
}
function isRightClick(event) {
  return event.button !== 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addDomEvent,
  ariaAttr,
  canUseDOM,
  contains,
  cx,
  dataAttr,
  getActiveElement,
  getEventWindow,
  getOwnerDocument,
  getOwnerWindow,
  getRelatedTarget,
  isBrowser,
  isElement,
  isHTMLElement,
  isRightClick,
  normalizeEventKey
});
