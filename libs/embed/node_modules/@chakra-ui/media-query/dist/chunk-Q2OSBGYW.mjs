'use client'
import {
  useMediaQuery
} from "./chunk-57I6FYPZ.mjs";

// src/visibility.tsx
function Visibility(props) {
  const { breakpoint, hide, children, ssr } = props;
  const [show] = useMediaQuery(breakpoint, { ssr });
  const isVisible = hide ? !show : show;
  const rendered = isVisible ? children : null;
  return rendered;
}

export {
  Visibility
};
//# sourceMappingURL=chunk-Q2OSBGYW.mjs.map