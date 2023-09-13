'use client'

// src/media-query.tsx
import { useTheme } from "@chakra-ui/system";
var getBreakpoint = (theme, value) => {
  var _a, _b;
  return (_b = (_a = theme == null ? void 0 : theme.breakpoints) == null ? void 0 : _a[value]) != null ? _b : value;
};
function useQuery(props) {
  const { breakpoint = "", below, above } = props;
  const theme = useTheme();
  const bpBelow = getBreakpoint(theme, below);
  const bpAbove = getBreakpoint(theme, above);
  let query = breakpoint;
  if (bpBelow) {
    query = `(max-width: ${bpBelow})`;
  } else if (bpAbove) {
    query = `(min-width: ${bpAbove})`;
  }
  return query;
}

export {
  useQuery
};
//# sourceMappingURL=chunk-OYHRTWD2.mjs.map