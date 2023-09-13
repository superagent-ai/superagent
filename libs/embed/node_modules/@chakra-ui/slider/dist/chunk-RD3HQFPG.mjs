'use client'
import {
  useRangeSlider
} from "./chunk-K3MZ7A5P.mjs";
import {
  cx
} from "./chunk-DX64QB22.mjs";

// src/range-slider.tsx
import { createContext } from "@chakra-ui/react-context";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig,
  useTheme
} from "@chakra-ui/system";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var [RangeSliderProvider, useRangeSliderContext] = createContext({
  name: "SliderContext",
  errorMessage: "useSliderContext: `context` is undefined. Seems you forgot to wrap all slider components within <RangeSlider />"
});
var [RangeSliderStylesProvider, useRangeSliderStyles] = createContext({
  name: `RangeSliderStylesContext`,
  errorMessage: `useRangeSliderStyles returned is 'undefined'. Seems you forgot to wrap the components in "<RangeSlider />" `
});
var RangeSlider = forwardRef(
  function RangeSlider2(props, ref) {
    const sliderProps = {
      orientation: "horizontal",
      ...props
    };
    const styles = useMultiStyleConfig("Slider", sliderProps);
    const ownProps = omitThemingProps(sliderProps);
    const { direction } = useTheme();
    ownProps.direction = direction;
    const { getRootProps, ...context } = useRangeSlider(ownProps);
    const ctx = useMemo(
      () => ({ ...context, name: sliderProps.name }),
      [context, sliderProps.name]
    );
    return /* @__PURE__ */ jsx(RangeSliderProvider, { value: ctx, children: /* @__PURE__ */ jsx(RangeSliderStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...getRootProps({}, ref),
        className: "chakra-slider",
        __css: styles.container,
        children: sliderProps.children
      }
    ) }) });
  }
);
RangeSlider.displayName = "RangeSlider";
var RangeSliderThumb = forwardRef(
  function RangeSliderThumb2(props, ref) {
    const { getThumbProps, getInputProps, name } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const thumbProps = getThumbProps(props, ref);
    return /* @__PURE__ */ jsxs(
      chakra.div,
      {
        ...thumbProps,
        className: cx("chakra-slider__thumb", props.className),
        __css: styles.thumb,
        children: [
          thumbProps.children,
          name && /* @__PURE__ */ jsx("input", { ...getInputProps({ index: props.index }) })
        ]
      }
    );
  }
);
RangeSliderThumb.displayName = "RangeSliderThumb";
var RangeSliderTrack = forwardRef(
  function RangeSliderTrack2(props, ref) {
    const { getTrackProps } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const trackProps = getTrackProps(props, ref);
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...trackProps,
        className: cx("chakra-slider__track", props.className),
        __css: styles.track,
        "data-testid": "chakra-range-slider-track"
      }
    );
  }
);
RangeSliderTrack.displayName = "RangeSliderTrack";
var RangeSliderFilledTrack = forwardRef(function RangeSliderFilledTrack2(props, ref) {
  const { getInnerTrackProps } = useRangeSliderContext();
  const styles = useRangeSliderStyles();
  const trackProps = getInnerTrackProps(props, ref);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ...trackProps,
      className: "chakra-slider__filled-track",
      __css: styles.filledTrack
    }
  );
});
RangeSliderFilledTrack.displayName = "RangeSliderFilledTrack";
var RangeSliderMark = forwardRef(
  function RangeSliderMark2(props, ref) {
    const { getMarkerProps } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const markProps = getMarkerProps(props, ref);
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...markProps,
        className: cx("chakra-slider__marker", props.className),
        __css: styles.mark
      }
    );
  }
);
RangeSliderMark.displayName = "RangeSliderMark";

export {
  RangeSliderProvider,
  useRangeSliderContext,
  useRangeSliderStyles,
  RangeSlider,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderMark
};
//# sourceMappingURL=chunk-RD3HQFPG.mjs.map