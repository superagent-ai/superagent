'use client'
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
  useFocusOnPointerDown: () => useFocusOnPointerDown
});
module.exports = __toCommonJS(src_exports);
var import_react_use_event_listener = require("@chakra-ui/react-use-event-listener");
function isRefObject(val) {
  return "current" in val;
}
var isDom = () => typeof window !== "undefined";
function getPlatform() {
  var _a;
  const agent = navigator.userAgentData;
  return (_a = agent == null ? void 0 : agent.platform) != null ? _a : navigator.platform;
}
var vn = (v) => isDom() && v.test(navigator.vendor);
var pt = (v) => isDom() && v.test(getPlatform());
var isApple = () => pt(/mac|iphone|ipad|ipod/i);
var isSafari = () => isApple() && vn(/apple/i);
function useFocusOnPointerDown(props) {
  const { ref, elements, enabled } = props;
  const doc = () => {
    var _a, _b;
    return (_b = (_a = ref.current) == null ? void 0 : _a.ownerDocument) != null ? _b : document;
  };
  (0, import_react_use_event_listener.useEventListener)(doc, "pointerdown", (event) => {
    if (!isSafari() || !enabled)
      return;
    const target = event.target;
    const els = elements != null ? elements : [ref];
    const isValidTarget = els.some((elementOrRef) => {
      const el = isRefObject(elementOrRef) ? elementOrRef.current : elementOrRef;
      return (el == null ? void 0 : el.contains(target)) || el === target;
    });
    if (doc().activeElement !== target && isValidTarget) {
      event.preventDefault();
      target.focus();
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFocusOnPointerDown
});
//# sourceMappingURL=index.js.map