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

// src/progress-label.tsx
var progress_label_exports = {};
__export(progress_label_exports, {
  ProgressLabel: () => ProgressLabel
});
module.exports = __toCommonJS(progress_label_exports);
var import_system3 = require("@chakra-ui/system");

// src/progress.tsx
var import_system2 = require("@chakra-ui/system");
var import_react_context = require("@chakra-ui/react-context");

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

// src/progress.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var [ProgressStylesProvider, useProgressStyles] = (0, import_react_context.createContext)({
  name: `ProgressStylesContext`,
  errorMessage: `useProgressStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Progress />" `
});
var ProgressFilledTrack = (0, import_system2.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system2.chakra.div,
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
var Progress = (0, import_system2.forwardRef)((props, ref) => {
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
  } = (0, import_system2.omitThemingProps)(props);
  const styles = (0, import_system2.useMultiStyleConfig)("Progress", props);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.div,
    {
      ref,
      borderRadius,
      __css: trackStyles,
      ...rest,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProgressStylesProvider, { value: styles, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system3.chakra.div, { ...props, __css: labelStyles });
};
ProgressLabel.displayName = "ProgressLabel";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProgressLabel
});
//# sourceMappingURL=progress-label.js.map