'use client'
import {
  Visibility
} from "./chunk-Q2OSBGYW.mjs";
import {
  useQuery
} from "./chunk-OYHRTWD2.mjs";

// src/hide.tsx
import { jsx } from "react/jsx-runtime";
function Hide(props) {
  const { children, ssr } = props;
  const query = useQuery(props);
  return /* @__PURE__ */ jsx(Visibility, { breakpoint: query, hide: true, ssr, children });
}
Hide.displayName = "Hide";

export {
  Hide
};
//# sourceMappingURL=chunk-E2LBHKJ2.mjs.map