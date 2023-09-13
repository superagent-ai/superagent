'use client'
import {
  Visibility
} from "./chunk-Q2OSBGYW.mjs";
import {
  useQuery
} from "./chunk-OYHRTWD2.mjs";

// src/show.tsx
import { jsx } from "react/jsx-runtime";
function Show(props) {
  const { children, ssr } = props;
  const query = useQuery(props);
  return /* @__PURE__ */ jsx(Visibility, { breakpoint: query, ssr, children });
}
Show.displayName = "Show";

export {
  Show
};
//# sourceMappingURL=chunk-VXCSBZ7K.mjs.map