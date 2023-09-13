'use client'

// src/checkbox-icon.tsx
import { chakra } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
function CheckIcon(props) {
  return /* @__PURE__ */ jsx(
    chakra.svg,
    {
      width: "1.2em",
      viewBox: "0 0 12 10",
      style: {
        fill: "none",
        strokeWidth: 2,
        stroke: "currentColor",
        strokeDasharray: 16
      },
      ...props,
      children: /* @__PURE__ */ jsx("polyline", { points: "1.5 6 4.5 9 10.5 1" })
    }
  );
}
function IndeterminateIcon(props) {
  return /* @__PURE__ */ jsx(
    chakra.svg,
    {
      width: "1.2em",
      viewBox: "0 0 24 24",
      style: { stroke: "currentColor", strokeWidth: 4 },
      ...props,
      children: /* @__PURE__ */ jsx("line", { x1: "21", x2: "3", y1: "12", y2: "12" })
    }
  );
}
function CheckboxIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;
  const BaseIcon = isIndeterminate ? IndeterminateIcon : CheckIcon;
  return isChecked || isIndeterminate ? /* @__PURE__ */ jsx(
    chakra.div,
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      },
      children: /* @__PURE__ */ jsx(BaseIcon, { ...rest })
    }
  ) : null;
}

export {
  CheckboxIcon
};
//# sourceMappingURL=chunk-ULEC7HZU.mjs.map