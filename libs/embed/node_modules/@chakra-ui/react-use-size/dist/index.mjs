'use client'

// src/index.ts
import { trackElementSize } from "@zag-js/element-size";
import { useEffect, useLayoutEffect, useState } from "react";
var useSafeLayoutEffect = Boolean(globalThis == null ? void 0 : globalThis.document) ? useLayoutEffect : useEffect;
function trackMutation(el, cb) {
  var _a, _b;
  if (!el || !el.parentElement)
    return;
  const win = (_b = (_a = el.ownerDocument) == null ? void 0 : _a.defaultView) != null ? _b : window;
  const observer = new win.MutationObserver(() => {
    cb();
  });
  observer.observe(el.parentElement, { childList: true });
  return () => {
    observer.disconnect();
  };
}
function useSizes({
  getNodes,
  observeMutation = true
}) {
  const [sizes, setSizes] = useState([]);
  const [count, setCount] = useState(0);
  useSafeLayoutEffect(() => {
    const elements = getNodes();
    const cleanups = elements.map(
      (element, index) => trackElementSize(element, (size) => {
        setSizes((sizes2) => {
          return [
            ...sizes2.slice(0, index),
            size,
            ...sizes2.slice(index + 1)
          ];
        });
      })
    );
    if (observeMutation) {
      const firstNode = elements[0];
      cleanups.push(
        trackMutation(firstNode, () => {
          setCount((count2) => count2 + 1);
        })
      );
    }
    return () => {
      cleanups.forEach((cleanup) => {
        cleanup == null ? void 0 : cleanup();
      });
    };
  }, [count]);
  return sizes;
}
function isRef(ref) {
  return typeof ref === "object" && ref !== null && "current" in ref;
}
function useSize(subject) {
  const [size] = useSizes({
    observeMutation: false,
    getNodes() {
      const node = isRef(subject) ? subject.current : subject;
      return [node];
    }
  });
  return size;
}
export {
  useSize,
  useSizes
};
//# sourceMappingURL=index.mjs.map