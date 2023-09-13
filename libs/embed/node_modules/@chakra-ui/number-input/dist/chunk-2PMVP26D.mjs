'use client'

// src/use-attr-observer.ts
import { useEffect } from "react";
function useAttributeObserver(ref, attributes, fn, enabled) {
  useEffect(() => {
    var _a;
    if (!ref.current || !enabled)
      return;
    const win = (_a = ref.current.ownerDocument.defaultView) != null ? _a : window;
    const attrs = Array.isArray(attributes) ? attributes : [attributes];
    const obs = new win.MutationObserver((changes) => {
      for (const change of changes) {
        if (change.type === "attributes" && change.attributeName && attrs.includes(change.attributeName)) {
          fn(change);
        }
      }
    });
    obs.observe(ref.current, { attributes: true, attributeFilter: attrs });
    return () => obs.disconnect();
  });
}

export {
  useAttributeObserver
};
//# sourceMappingURL=chunk-2PMVP26D.mjs.map