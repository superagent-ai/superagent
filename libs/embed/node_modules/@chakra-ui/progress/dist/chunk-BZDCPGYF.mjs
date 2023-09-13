'use client'
import {
  getProgressProps,
  progress,
  stripe
} from "./chunk-TXZFUZNG.mjs";

// src/progress.tsx
import {
  chakra,
  omitThemingProps,
  useMultiStyleConfig,
  forwardRef
} from "@chakra-ui/system";
import { createContext } from "@chakra-ui/react-context";
import { jsx, jsxs } from "react/jsx-runtime";
var [ProgressStylesProvider, useProgressStyles] = createContext({
  name: `ProgressStylesContext`,
  errorMessage: `useProgressStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Progress />" `
});
var ProgressFilledTrack = forwardRef(
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
    return /* @__PURE__ */ jsx(
      chakra.div,
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
var Progress = forwardRef((props, ref) => {
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
  } = omitThemingProps(props);
  const styles = useMultiStyleConfig("Progress", props);
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
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      borderRadius,
      __css: trackStyles,
      ...rest,
      children: /* @__PURE__ */ jsxs(ProgressStylesProvider, { value: styles, children: [
        /* @__PURE__ */ jsx(
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

export {
  useProgressStyles,
  Progress
};
//# sourceMappingURL=chunk-BZDCPGYF.mjs.map