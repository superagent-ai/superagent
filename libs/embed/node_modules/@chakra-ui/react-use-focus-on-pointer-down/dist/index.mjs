'use client'

// src/index.ts
import { useEventListener } from "@chakra-ui/react-use-event-listener";
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
  useEventListener(doc, "pointerdown", (event) => {
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
export {
  useFocusOnPointerDown
};
//# sourceMappingURL=index.mjs.map