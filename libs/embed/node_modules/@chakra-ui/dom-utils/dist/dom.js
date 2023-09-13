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
  contains: () => contains,
  getActiveElement: () => getActiveElement,
  getEventWindow: () => getEventWindow,
  getOwnerDocument: () => getOwnerDocument,
  getOwnerWindow: () => getOwnerWindow,
  isBrowser: () => isBrowser,
  isElement: () => isElement,
  isHTMLElement: () => isHTMLElement
});
module.exports = __toCommonJS(dom_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  contains,
  getActiveElement,
  getEventWindow,
  getOwnerDocument,
  getOwnerWindow,
  isBrowser,
  isElement,
  isHTMLElement
});
