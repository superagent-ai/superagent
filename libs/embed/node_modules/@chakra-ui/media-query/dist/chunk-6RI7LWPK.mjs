'use client'
import {
  useMediaQuery
} from "./chunk-57I6FYPZ.mjs";

// src/media-query.hook.ts
function usePrefersReducedMotion(options) {
  const [prefersReducedMotion] = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    options
  );
  return prefersReducedMotion;
}
function useColorModePreference(options) {
  const [isLight, isDark] = useMediaQuery(
    ["(prefers-color-scheme: light)", "(prefers-color-scheme: dark)"],
    options
  );
  if (isLight)
    return "light";
  if (isDark)
    return "dark";
  return void 0;
}

export {
  usePrefersReducedMotion,
  useColorModePreference
};
//# sourceMappingURL=chunk-6RI7LWPK.mjs.map