'use client'
import {
  useMediaQuery
} from "./chunk-57I6FYPZ.mjs";

// src/use-breakpoint.ts
import { useTheme } from "@chakra-ui/system";
import { isObject } from "@chakra-ui/shared-utils";
function useBreakpoint(arg) {
  var _a, _b;
  const opts = isObject(arg) ? arg : { fallback: arg != null ? arg : "base" };
  const theme = useTheme();
  const breakpoints = theme.__breakpoints.details.map(
    ({ minMaxQuery, breakpoint }) => ({
      breakpoint,
      query: minMaxQuery.replace("@media screen and ", "")
    })
  );
  const fallback = breakpoints.map((bp) => bp.breakpoint === opts.fallback);
  const values = useMediaQuery(
    breakpoints.map((bp) => bp.query),
    { fallback, ssr: opts.ssr }
  );
  const index = values.findIndex((value) => value == true);
  return (_b = (_a = breakpoints[index]) == null ? void 0 : _a.breakpoint) != null ? _b : opts.fallback;
}

export {
  useBreakpoint
};
//# sourceMappingURL=chunk-6KW5I77S.mjs.map