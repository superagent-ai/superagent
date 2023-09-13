'use client'
import {
  useSlider
} from "./chunk-45OCWRAV.mjs";
import {
  cx
} from "./chunk-DX64QB22.mjs";

// src/slider.tsx
import { createContext } from "@chakra-ui/react-context";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig,
  useTheme
} from "@chakra-ui/system";
import { jsx, jsxs } from "react/jsx-runtime";
var [SliderProvider, useSliderContext] = createContext({
  name: "SliderContext",
  hookName: "useSliderContext",
  providerName: "<Slider />"
});
var [SliderStylesProvider, useSliderStyles] = createContext({
  name: `SliderStylesContext`,
  hookName: `useSliderStyles`,
  providerName: "<Slider />"
});
var Slider = forwardRef((props, ref) => {
  var _a;
  const sliderProps = {
    ...props,
    orientation: (_a = props == null ? void 0 : props.orientation) != null ? _a : "horizontal"
  };
  const styles = useMultiStyleConfig("Slider", sliderProps);
  const ownProps = omitThemingProps(sliderProps);
  const { direction } = useTheme();
  ownProps.direction = direction;
  const { getInputProps, getRootProps, ...context } = useSlider(ownProps);
  const rootProps = getRootProps();
  const inputProps = getInputProps({}, ref);
  return /* @__PURE__ */ jsx(SliderProvider, { value: context, children: /* @__PURE__ */ jsx(SliderStylesProvider, { value: styles, children: /* @__PURE__ */ jsxs(
    chakra.div,
    {
      ...rootProps,
      className: cx("chakra-slider", sliderProps.className),
      __css: styles.container,
      children: [
        sliderProps.children,
        /* @__PURE__ */ jsx("input", { ...inputProps })
      ]
    }
  ) }) });
});
Slider.displayName = "Slider";
var SliderThumb = forwardRef((props, ref) => {
  const { getThumbProps } = useSliderContext();
  const styles = useSliderStyles();
  const thumbProps = getThumbProps(props, ref);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ...thumbProps,
      className: cx("chakra-slider__thumb", props.className),
      __css: styles.thumb
    }
  );
});
SliderThumb.displayName = "SliderThumb";
var SliderTrack = forwardRef((props, ref) => {
  const { getTrackProps } = useSliderContext();
  const styles = useSliderStyles();
  const trackProps = getTrackProps(props, ref);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ...trackProps,
      className: cx("chakra-slider__track", props.className),
      __css: styles.track
    }
  );
});
SliderTrack.displayName = "SliderTrack";
var SliderFilledTrack = forwardRef(
  (props, ref) => {
    const { getInnerTrackProps } = useSliderContext();
    const styles = useSliderStyles();
    const trackProps = getInnerTrackProps(props, ref);
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...trackProps,
        className: cx("chakra-slider__filled-track", props.className),
        __css: styles.filledTrack
      }
    );
  }
);
SliderFilledTrack.displayName = "SliderFilledTrack";
var SliderMark = forwardRef((props, ref) => {
  const { getMarkerProps } = useSliderContext();
  const styles = useSliderStyles();
  const markProps = getMarkerProps(props, ref);
  return /* @__PURE__ */ jsx(
    chakra.div,
    {
      ...markProps,
      className: cx("chakra-slider__marker", props.className),
      __css: styles.mark
    }
  );
});
SliderMark.displayName = "SliderMark";

export {
  SliderProvider,
  useSliderContext,
  useSliderStyles,
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
  SliderMark
};
//# sourceMappingURL=chunk-6KSEUUNN.mjs.map