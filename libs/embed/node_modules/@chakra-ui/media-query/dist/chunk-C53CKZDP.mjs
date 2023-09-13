'use client'

// src/media-query.utils.ts
import { breakpoints as defaultBreakPoints } from "@chakra-ui/breakpoint-utils";
function getClosestValue(values, breakpoint, breakpoints = defaultBreakPoints) {
  let index = Object.keys(values).indexOf(breakpoint);
  if (index !== -1) {
    return values[breakpoint];
  }
  let stopIndex = breakpoints.indexOf(breakpoint);
  while (stopIndex >= 0) {
    const key = breakpoints[stopIndex];
    if (values.hasOwnProperty(key)) {
      index = stopIndex;
      break;
    }
    stopIndex -= 1;
  }
  if (index !== -1) {
    const key = breakpoints[index];
    return values[key];
  }
  return void 0;
}

export {
  getClosestValue
};
//# sourceMappingURL=chunk-C53CKZDP.mjs.map