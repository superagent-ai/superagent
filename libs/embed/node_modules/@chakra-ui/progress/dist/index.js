'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CircularProgress: () => CircularProgress,
  CircularProgressLabel: () => CircularProgressLabel,
  Progress: () => Progress,
  ProgressLabel: () => ProgressLabel,
  useProgressStyles: () => useProgressStyles
});
module.exports = __toCommonJS(src_exports);

// src/circular-progress.tsx
var import_system4 = require("@chakra-ui/system");

// src/progress.utils.tsx
var import_system = require("@chakra-ui/system");
function valueToPercent(value, min, max) {
  return (value - min) * 100 / (max - min);
}
var spin = (0, import_system.keyframes)({
  "0%": {
    strokeDasharray: "1, 400",
    strokeDashoffset: "0"
  },
  "50%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-100"
  },
  "100%": {
    strokeDasharray: "400, 400",
    strokeDashoffset: "-260"
  }
});
var rotate = (0, import_system.keyframes)({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
var progress = (0, import_system.keyframes)({
  "0%": { left: "-40%" },
  "100%": { left: "100%" }
});
var stripe = (0, import_system.keyframes)({
  from: { backgroundPosition: "1rem 0" },
  to: { backgroundPosition: "0 0" }
});
function getProgressProps(options) {
  const {
    value = 0,
    min,
    max,
    valueText,
    getValueText,
    isIndeterminate,
    role = "progressbar"
  } = options;
  const percent = valueToPercent(value, min, max);
  const getAriaValueText = () => {
    if (value == null)
      return void 0;
    return typeof getValueText === "function" ? getValueText(value, percent) : valueText;
  };
  return {
    bind: {
      "data-indeterminate": isIndeterminate ? "" : void 0,
      "aria-valuemax": max,
      "aria-valuemin": min,
      "aria-valuenow": isIndeterminate ? void 0 : value,
      "aria-valuetext": getAriaValueText(),
      role
    },
    percent,
    value
  };
}

// src/shape.tsx
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var Shape = (props) => {
  const { size, isIndeterminate, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.svg,
    {
      viewBox: "0 0 100 100",
      __css: {
        width: size,
        height: size,
        animation: isIndeterminate ? `${rotate} 2s linear infinite` : void 0
      },
      ...rest
    }
  );
};
Shape.displayName = "Shape";

// src/circle.tsx
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var Circle = (props) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system3.chakra.circle, { cx: 50, cy: 50, r: 42, fill: "transparent", ...props });
Circle.displayName = "Circle";

// src/circular-progress.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var CircularProgress = (0, import_system4.forwardRef)(
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
    const progress2 = getProgressProps({
      min,
      max,
      value,
      valueText,
      getValueText,
      isIndeterminate
    });
    const determinant = isIndeterminate ? void 0 : ((_a = progress2.percent) != null ? _a : 0) * 2.64;
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
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      import_system4.chakra.div,
      {
        ref,
        className: "chakra-progress",
        ...progress2.bind,
        ...rest,
        __css: rootStyles,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Shape, { size, isIndeterminate, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              Circle,
              {
                stroke: trackColor,
                strokeWidth: thickness,
                className: "chakra-progress__track"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              Circle,
              {
                stroke: color,
                strokeWidth: thickness,
                className: "chakra-progress__indicator",
                strokeLinecap: capIsRound ? "round" : void 0,
                opacity: progress2.value === 0 && !isIndeterminate ? 0 : void 0,
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

// src/progress.tsx
var import_system5 = require("@chakra-ui/system");
var import_react_context = require("@chakra-ui/react-context");
var import_jsx_runtime4 = require("react/jsx-runtime");
var [ProgressStylesProvider, useProgressStyles] = (0, import_react_context.createContext)({
  name: `ProgressStylesContext`,
  errorMessage: `useProgressStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Progress />" `
});
var ProgressFilledTrack = (0, import_system5.forwardRef)(
  (props, ref) => {
    const { min, max, value, isIndeterminate, role, ...rest } = props;
    const progress2 = getProgressProps({
      value,
      min,
      max,
      isIndeterminate,
      role
    });
    const styles = useProgressStyles();
    const trackStyles = {
      height: "100%",
      ...styles.filledTrack
    };
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system5.chakra.div,
      {
        ref,
        style: { width: `${progress2.percent}%`, ...rest.style },
        ...progress2.bind,
        ...rest,
        __css: trackStyles
      }
    );
  }
);
var Progress = (0, import_system5.forwardRef)((props, ref) => {
  var _a;
  const {
    value,
    min = 0,
    max = 100,
    hasStripe,
    isAnimated,
    children,
    borderRadius: propBorderRadius,
    isIndeterminate,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-valuetext": ariaValueText,
    title,
    role,
    ...rest
  } = (0, import_system5.omitThemingProps)(props);
  const styles = (0, import_system5.useMultiStyleConfig)("Progress", props);
  const borderRadius = propBorderRadius != null ? propBorderRadius : (_a = styles.track) == null ? void 0 : _a.borderRadius;
  const stripeAnimation = { animation: `${stripe} 1s linear infinite` };
  const shouldAddStripe = !isIndeterminate && hasStripe;
  const shouldAnimateStripe = shouldAddStripe && isAnimated;
  const css = {
    ...shouldAnimateStripe && stripeAnimation,
    ...isIndeterminate && {
      position: "absolute",
      willChange: "left",
      minWidth: "50%",
      animation: `${progress} 1s ease infinite normal none running`
    }
  };
  const trackStyles = {
    overflow: "hidden",
    position: "relative",
    ...styles.track
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_system5.chakra.div,
    {
      ref,
      borderRadius,
      __css: trackStyles,
      ...rest,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(ProgressStylesProvider, { value: styles, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          ProgressFilledTrack,
          {
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-valuetext": ariaValueText,
            min,
            max,
            value,
            isIndeterminate,
            css,
            borderRadius,
            title,
            role
          }
        ),
        children
      ] })
    }
  );
});
Progress.displayName = "Progress";

// src/progress-label.tsx
var import_system6 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var ProgressLabel = (props) => {
  const styles = useProgressStyles();
  const labelStyles = {
    top: "50%",
    left: "50%",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    ...styles.label
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_system6.chakra.div, { ...props, __css: labelStyles });
};
ProgressLabel.displayName = "ProgressLabel";

// src/circular-progress-label.tsx
var import_system7 = require("@chakra-ui/system");
var CircularProgressLabel = (0, import_system7.chakra)("div", {
  baseStyle: {
    fontSize: "0.24em",
    top: "50%",
    left: "50%",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)"
  }
});
CircularProgressLabel.displayName = "CircularProgressLabel";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CircularProgress,
  CircularProgressLabel,
  Progress,
  ProgressLabel,
  useProgressStyles
});
//# sourceMappingURL=index.js.map