'use client'
import {
  Circle
} from "./chunk-7CG3L4JY.mjs";
import {
  Shape
} from "./chunk-EMKK5VRD.mjs";
import {
  getProgressProps,
  spin
} from "./chunk-TXZFUZNG.mjs";

// src/circular-progress.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx, jsxs } from "react/jsx-runtime";
var CircularProgress = forwardRef(
  (props, ref) => {
    var _a;
    const {
      size = "48px",
      max = 100,
      min = 0,
      valueText,
      getValueText,
      value,
      capIsRound,
      children,
      thickness = "10px",
      color = "#0078d4",
      trackColor = "#edebe9",
      isIndeterminate,
      ...rest
    } = props;
    const progress = getProgressProps({
      min,
      max,
      value,
      valueText,
      getValueText,
      isIndeterminate
    });
    const determinant = isIndeterminate ? void 0 : ((_a = progress.percent) != null ? _a : 0) * 2.64;
    const strokeDasharray = determinant == null ? void 0 : `${determinant} ${264 - determinant}`;
    const indicatorProps = isIndeterminate ? {
      css: { animation: `${spin} 1.5s linear infinite` }
    } : {
      strokeDashoffset: 66,
      strokeDasharray,
      transitionProperty: "stroke-dasharray, stroke",
      transitionDuration: "0.6s",
      transitionTimingFunction: "ease"
    };
    const rootStyles = {
      display: "inline-block",
      position: "relative",
      verticalAlign: "middle",
      fontSize: size
    };
    return /* @__PURE__ */ jsxs(
      chakra.div,
      {
        ref,
        className: "chakra-progress",
        ...progress.bind,
        ...rest,
        __css: rootStyles,
        children: [
          /* @__PURE__ */ jsxs(Shape, { size, isIndeterminate, children: [
            /* @__PURE__ */ jsx(
              Circle,
              {
                stroke: trackColor,
                strokeWidth: thickness,
                className: "chakra-progress__track"
              }
            ),
            /* @__PURE__ */ jsx(
              Circle,
              {
                stroke: color,
                strokeWidth: thickness,
                className: "chakra-progress__indicator",
                strokeLinecap: capIsRound ? "round" : void 0,
                opacity: progress.value === 0 && !isIndeterminate ? 0 : void 0,
                ...indicatorProps
              }
            )
          ] }),
          children
        ]
      }
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export {
  CircularProgress
};
//# sourceMappingURL=chunk-Q6Q7I7E5.mjs.map