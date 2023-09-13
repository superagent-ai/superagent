'use client'

// src/index.ts
import { useMemo } from "react";
function assignRef(ref, value) {
  if (ref == null)
    return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  try {
    ref.current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      assignRef(ref, node);
    });
  };
}
function useMergeRefs(...refs) {
  return useMemo(() => mergeRefs(...refs), refs);
}
export {
  assignRef,
  mergeRefs,
  useMergeRefs
};
//# sourceMappingURL=index.mjs.map