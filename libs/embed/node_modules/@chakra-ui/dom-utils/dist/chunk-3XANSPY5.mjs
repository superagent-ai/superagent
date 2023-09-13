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

export {
  isElement,
  isHTMLElement,
  getOwnerWindow,
  getOwnerDocument,
  getEventWindow,
  isBrowser,
  getActiveElement,
  contains
};
