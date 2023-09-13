'use client'
import {
  getClosestValue
} from "./chunk-C53CKZDP.mjs";
import {
  useBreakpoint
} from "./chunk-6KW5I77S.mjs";

// src/use-breakpoint-value.ts
import { useTheme } from "@chakra-ui/system";
import { isObject } from "@chakra-ui/shared-utils";
import { arrayToObjectNotation } from "@chakra-ui/breakpoint-utils";
function useBreakpointValue(values, arg) {
  var _a;
  const opts = isObject(arg) ? arg : { fallback: arg != null ? arg : "base" };
  const breakpoint = useBreakpoint(opts);
  const theme = useTheme();
  if (!breakpoint)
    return;
  const breakpoints = Array.from(((_a = theme.__breakpoints) == null ? void 0 : _a.keys) || []);
  const obj = Array.isArray(values) ? Object.fromEntries(
    Object.entries(arrayToObjectNotation(values, breakpoints)).map(
      ([key, value]) => [key, value]
    )
  ) : values;
  return getClosestValue(obj, breakpoint, breakpoints);
}

export {
  useBreakpointValue
};
//# sourceMappingURL=chunk-KC77MHL3.mjs.map