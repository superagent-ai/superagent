'use client'

// src/index.ts
import { useEffect, useLayoutEffect } from "react";
var useSafeLayoutEffect = Boolean(globalThis == null ? void 0 : globalThis.document) ? useLayoutEffect : useEffect;
export {
  useSafeLayoutEffect
};
//# sourceMappingURL=index.mjs.map