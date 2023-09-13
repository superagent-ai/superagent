import {
  usePointerEvent
} from "./chunk-CF2OMLUG.mjs";

// src/use-focus-on-pointerdown.ts
import {
  contains,
  detectBrowser,
  focus,
  getOwnerDocument,
  isActiveElement,
  isRefObject
} from "@chakra-ui/utils";
function useFocusOnPointerDown(props) {
  const { ref, elements, enabled } = props;
  const isSafari = detectBrowser("Safari");
  const doc = () => getOwnerDocument(ref.current);
  usePointerEvent(doc, "pointerdown", (event) => {
    if (!isSafari || !enabled)
      return;
    const target = event.target;
    const els = elements != null ? elements : [ref];
    const isValidTarget = els.some((elementOrRef) => {
      const el = isRefObject(elementOrRef) ? elementOrRef.current : elementOrRef;
      return contains(el, target);
    });
    if (!isActiveElement(target) && isValidTarget) {
      event.preventDefault();
      focus(target);
    }
  });
}

export {
  useFocusOnPointerDown
};
