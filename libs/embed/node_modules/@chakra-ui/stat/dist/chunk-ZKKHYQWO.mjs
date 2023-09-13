'use client'
import {
  useStatStyles
} from "./chunk-W64KV3Y7.mjs";

// src/stat-arrow.tsx
import { Icon } from "@chakra-ui/icon";
import { chakra } from "@chakra-ui/system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var StatDownArrow = (props) => /* @__PURE__ */ jsx(Icon, { color: "red.400", ...props, children: /* @__PURE__ */ jsx(
  "path",
  {
    fill: "currentColor",
    d: "M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"
  }
) });
StatDownArrow.displayName = "StatDownArrow";
function StatUpArrow(props) {
  return /* @__PURE__ */ jsx(Icon, { color: "green.400", ...props, children: /* @__PURE__ */ jsx(
    "path",
    {
      fill: "currentColor",
      d: "M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"
    }
  ) });
}
StatUpArrow.displayName = "StatUpArrow";
function StatArrow(props) {
  const { type, "aria-label": ariaLabel, ...rest } = props;
  const styles = useStatStyles();
  const BaseIcon = type === "increase" ? StatUpArrow : StatDownArrow;
  const defaultAriaLabel = type === "increase" ? "increased by" : "decreased by";
  const label = ariaLabel || defaultAriaLabel;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(chakra.span, { srOnly: true, children: label }),
    /* @__PURE__ */ jsx(BaseIcon, { "aria-hidden": true, ...rest, __css: styles.icon })
  ] });
}
StatArrow.displayName = "StatArrow";

export {
  StatDownArrow,
  StatUpArrow,
  StatArrow
};
//# sourceMappingURL=chunk-ZKKHYQWO.mjs.map