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
  useAnimationState: () => useAnimationState
});
module.exports = __toCommonJS(src_exports);
var import_react = require("react");
var import_react_use_event_listener = require("@chakra-ui/react-use-event-listener");
var import_dom_utils = require("@chakra-ui/dom-utils");
function useAnimationState(props) {
  const { isOpen, ref } = props;
  const [mounted, setMounted] = (0, import_react.useState)(isOpen);
  const [once, setOnce] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    if (!once) {
      setMounted(isOpen);
      setOnce(true);
    }
  }, [isOpen, once, mounted]);
  (0, import_react_use_event_listener.useEventListener)(
    () => ref.current,
    "animationend",
    () => {
      setMounted(isOpen);
    }
  );
  const hidden = isOpen ? false : !mounted;
  return {
    present: !hidden,
    onComplete() {
      var _a;
      const win = (0, import_dom_utils.getOwnerWindow)(ref.current);
      const evt = new win.CustomEvent("animationend", { bubbles: true });
      (_a = ref.current) == null ? void 0 : _a.dispatchEvent(evt);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAnimationState
});
//# sourceMappingURL=index.js.map