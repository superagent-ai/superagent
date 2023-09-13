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

// src/slider.tsx
var slider_exports = {};
__export(slider_exports, {
  Slider: () => Slider,
  SliderFilledTrack: () => SliderFilledTrack,
  SliderMark: () => SliderMark,
  SliderProvider: () => SliderProvider,
  SliderThumb: () => SliderThumb,
  SliderTrack: () => SliderTrack,
  useSliderContext: () => useSliderContext,
  useSliderStyles: () => useSliderStyles
});
module.exports = __toCommonJS(slider_exports);
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");

// ../../legacy/utils/src/dom.ts
var dataAttr = (condition) => condition ? "" : void 0;
var ariaAttr = (condition) => condition ? true : void 0;
var cx = (...classNames) => classNames.filter(Boolean).join(" ");

// ../../legacy/utils/src/function.ts
function callAllHandlers(...fns) {
  return function func(event) {
    fns.some((fn) => {
      fn == null ? void 0 : fn(event);
      return event == null ? void 0 : event.defaultPrevented;
    });
  };
}

// src/use-slider.ts
var import_react_use_pan_event = require("@chakra-ui/react-use-pan-event");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_react_use_size = require("@chakra-ui/react-use-size");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_react_use_latest_ref = require("@chakra-ui/react-use-latest-ref");
var import_number_utils = require("@chakra-ui/number-utils");
var import_react = require("react");

// src/slider-utils.ts
function orient(options) {
  const { orientation, vertical, horizontal } = options;
  return orientation === "vertical" ? vertical : horizontal;
}
var zeroSize = { width: 0, height: 0 };
var normalize = (a) => a || zeroSize;
function getStyles(options) {
  const { orientation, thumbPercents, thumbRects, isReversed } = options;
  const getThumbStyle = (i) => {
    var _a;
    const rect = (_a = thumbRects[i]) != null ? _a : zeroSize;
    return {
      position: "absolute",
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      touchAction: "none",
      ...orient({
        orientation,
        vertical: {
          bottom: `calc(${thumbPercents[i]}% - ${rect.height / 2}px)`
        },
        horizontal: {
          left: `calc(${thumbPercents[i]}% - ${rect.width / 2}px)`
        }
      })
    };
  };
  const size = orientation === "vertical" ? thumbRects.reduce(
    (a, b) => normalize(a).height > normalize(b).height ? a : b,
    zeroSize
  ) : thumbRects.reduce(
    (a, b) => normalize(a).width > normalize(b).width ? a : b,
    zeroSize
  );
  const rootStyle = {
    position: "relative",
    touchAction: "none",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
    userSelect: "none",
    outline: 0,
    ...orient({
      orientation,
      vertical: size ? {
        paddingLeft: size.width / 2,
        paddingRight: size.width / 2
      } : {},
      horizontal: size ? {
        paddingTop: size.height / 2,
        paddingBottom: size.height / 2
      } : {}
    })
  };
  const trackStyle = {
    position: "absolute",
    ...orient({
      orientation,
      vertical: {
        left: "50%",
        transform: "translateX(-50%)",
        height: "100%"
      },
      horizontal: {
        top: "50%",
        transform: "translateY(-50%)",
        width: "100%"
      }
    })
  };
  const isSingleThumb = thumbPercents.length === 1;
  const fallback = [0, isReversed ? 100 - thumbPercents[0] : thumbPercents[0]];
  const range = isSingleThumb ? fallback : thumbPercents;
  let start = range[0];
  if (!isSingleThumb && isReversed) {
    start = 100 - start;
  }
  const percent = Math.abs(range[range.length - 1] - range[0]);
  const innerTrackStyle = {
    ...trackStyle,
    ...orient({
      orientation,
      vertical: isReversed ? { height: `${percent}%`, top: `${start}%` } : { height: `${percent}%`, bottom: `${start}%` },
      horizontal: isReversed ? { width: `${percent}%`, right: `${start}%` } : { width: `${percent}%`, left: `${start}%` }
    })
  };
  return { trackStyle, innerTrackStyle, rootStyle, getThumbStyle };
}
function getIsReversed(options) {
  const { isReversed, direction, orientation } = options;
  if (direction === "ltr" || orientation === "vertical") {
    return isReversed;
  }
  return !isReversed;
}

// src/use-slider.ts
function useSlider(props) {
  var _a;
  const {
    min = 0,
    max = 100,
    onChange,
    value: valueProp,
    defaultValue,
    isReversed: isReversedProp,
    direction = "ltr",
    orientation = "horizontal",
    id: idProp,
    isDisabled,
    isReadOnly,
    onChangeStart: onChangeStartProp,
    onChangeEnd: onChangeEndProp,
    step = 1,
    getAriaValueText: getAriaValueTextProp,
    "aria-valuetext": ariaValueText,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    name,
    focusThumbOnChange = true,
    ...htmlProps
  } = props;
  const onChangeStart = (0, import_react_use_callback_ref.useCallbackRef)(onChangeStartProp);
  const onChangeEnd = (0, import_react_use_callback_ref.useCallbackRef)(onChangeEndProp);
  const getAriaValueText = (0, import_react_use_callback_ref.useCallbackRef)(getAriaValueTextProp);
  const isReversed = getIsReversed({
    isReversed: isReversedProp,
    direction,
    orientation
  });
  const [computedValue, setValue] = (0, import_react_use_controllable_state.useControllableState)({
    value: valueProp,
    defaultValue: defaultValue != null ? defaultValue : getDefaultValue(min, max),
    onChange
  });
  const [isDragging, setDragging] = (0, import_react.useState)(false);
  const [isFocused, setFocused] = (0, import_react.useState)(false);
  const isInteractive = !(isDisabled || isReadOnly);
  const tenSteps = (max - min) / 10;
  const oneStep = step || (max - min) / 100;
  const value = (0, import_number_utils.clampValue)(computedValue, min, max);
  const reversedValue = max - value + min;
  const trackValue = isReversed ? reversedValue : value;
  const thumbPercent = (0, import_number_utils.valueToPercent)(trackValue, min, max);
  const isVertical = orientation === "vertical";
  const stateRef = (0, import_react_use_latest_ref.useLatestRef)({
    min,
    max,
    step,
    isDisabled,
    value,
    isInteractive,
    isReversed,
    isVertical,
    eventSource: null,
    focusThumbOnChange,
    orientation
  });
  const trackRef = (0, import_react.useRef)(null);
  const thumbRef = (0, import_react.useRef)(null);
  const rootRef = (0, import_react.useRef)(null);
  const reactId = (0, import_react.useId)();
  const uuid = idProp != null ? idProp : reactId;
  const [thumbId, trackId] = [`slider-thumb-${uuid}`, `slider-track-${uuid}`];
  const getValueFromPointer = (0, import_react.useCallback)(
    (event) => {
      var _a2, _b;
      if (!trackRef.current)
        return;
      const state2 = stateRef.current;
      state2.eventSource = "pointer";
      const trackRect = trackRef.current.getBoundingClientRect();
      const { clientX, clientY } = (_b = (_a2 = event.touches) == null ? void 0 : _a2[0]) != null ? _b : event;
      const diff = isVertical ? trackRect.bottom - clientY : clientX - trackRect.left;
      const length = isVertical ? trackRect.height : trackRect.width;
      let percent = diff / length;
      if (isReversed) {
        percent = 1 - percent;
      }
      let nextValue = (0, import_number_utils.percentToValue)(percent, state2.min, state2.max);
      if (state2.step) {
        nextValue = parseFloat(
          (0, import_number_utils.roundValueToStep)(nextValue, state2.min, state2.step)
        );
      }
      nextValue = (0, import_number_utils.clampValue)(nextValue, state2.min, state2.max);
      return nextValue;
    },
    [isVertical, isReversed, stateRef]
  );
  const constrain = (0, import_react.useCallback)(
    (value2) => {
      const state2 = stateRef.current;
      if (!state2.isInteractive)
        return;
      value2 = parseFloat((0, import_number_utils.roundValueToStep)(value2, state2.min, oneStep));
      value2 = (0, import_number_utils.clampValue)(value2, state2.min, state2.max);
      setValue(value2);
    },
    [oneStep, setValue, stateRef]
  );
  const actions = (0, import_react.useMemo)(
    () => ({
      stepUp(step2 = oneStep) {
        const next = isReversed ? value - step2 : value + step2;
        constrain(next);
      },
      stepDown(step2 = oneStep) {
        const next = isReversed ? value + step2 : value - step2;
        constrain(next);
      },
      reset() {
        constrain(defaultValue || 0);
      },
      stepTo(value2) {
        constrain(value2);
      }
    }),
    [constrain, isReversed, value, oneStep, defaultValue]
  );
  const onKeyDown = (0, import_react.useCallback)(
    (event) => {
      const state2 = stateRef.current;
      const keyMap = {
        ArrowRight: () => actions.stepUp(),
        ArrowUp: () => actions.stepUp(),
        ArrowLeft: () => actions.stepDown(),
        ArrowDown: () => actions.stepDown(),
        PageUp: () => actions.stepUp(tenSteps),
        PageDown: () => actions.stepDown(tenSteps),
        Home: () => constrain(state2.min),
        End: () => constrain(state2.max)
      };
      const action = keyMap[event.key];
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        action(event);
        state2.eventSource = "keyboard";
      }
    },
    [actions, constrain, tenSteps, stateRef]
  );
  const valueText = (_a = getAriaValueText == null ? void 0 : getAriaValueText(value)) != null ? _a : ariaValueText;
  const thumbSize = (0, import_react_use_size.useSize)(thumbRef);
  const { getThumbStyle, rootStyle, trackStyle, innerTrackStyle } = (0, import_react.useMemo)(() => {
    const state2 = stateRef.current;
    const thumbRect = thumbSize != null ? thumbSize : { width: 0, height: 0 };
    return getStyles({
      isReversed,
      orientation: state2.orientation,
      thumbRects: [thumbRect],
      thumbPercents: [thumbPercent]
    });
  }, [isReversed, thumbSize, thumbPercent, stateRef]);
  const focusThumb = (0, import_react.useCallback)(() => {
    const state2 = stateRef.current;
    if (state2.focusThumbOnChange) {
      setTimeout(() => {
        var _a2;
        return (_a2 = thumbRef.current) == null ? void 0 : _a2.focus();
      });
    }
  }, [stateRef]);
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    const state2 = stateRef.current;
    focusThumb();
    if (state2.eventSource === "keyboard") {
      onChangeEnd == null ? void 0 : onChangeEnd(state2.value);
    }
  }, [value, onChangeEnd]);
  function setValueFromPointer(event) {
    const nextValue = getValueFromPointer(event);
    if (nextValue != null && nextValue !== stateRef.current.value) {
      setValue(nextValue);
    }
  }
  (0, import_react_use_pan_event.usePanEvent)(rootRef, {
    onPanSessionStart(event) {
      const state2 = stateRef.current;
      if (!state2.isInteractive)
        return;
      setDragging(true);
      focusThumb();
      setValueFromPointer(event);
      onChangeStart == null ? void 0 : onChangeStart(state2.value);
    },
    onPanSessionEnd() {
      const state2 = stateRef.current;
      if (!state2.isInteractive)
        return;
      setDragging(false);
      onChangeEnd == null ? void 0 : onChangeEnd(state2.value);
    },
    onPan(event) {
      const state2 = stateRef.current;
      if (!state2.isInteractive)
        return;
      setValueFromPointer(event);
    }
  });
  const getRootProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ...htmlProps,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, rootRef),
        tabIndex: -1,
        "aria-disabled": ariaAttr(isDisabled),
        "data-focused": dataAttr(isFocused),
        style: {
          ...props2.style,
          ...rootStyle
        }
      };
    },
    [htmlProps, isDisabled, isFocused, rootStyle]
  );
  const getTrackProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, trackRef),
        id: trackId,
        "data-disabled": dataAttr(isDisabled),
        style: {
          ...props2.style,
          ...trackStyle
        }
      };
    },
    [isDisabled, trackId, trackStyle]
  );
  const getInnerTrackProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref,
        style: {
          ...props2.style,
          ...innerTrackStyle
        }
      };
    },
    [innerTrackStyle]
  );
  const getThumbProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, thumbRef),
        role: "slider",
        tabIndex: isInteractive ? 0 : void 0,
        id: thumbId,
        "data-active": dataAttr(isDragging),
        "aria-valuetext": valueText,
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": value,
        "aria-orientation": orientation,
        "aria-disabled": ariaAttr(isDisabled),
        "aria-readonly": ariaAttr(isReadOnly),
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabel ? void 0 : ariaLabelledBy,
        style: {
          ...props2.style,
          ...getThumbStyle(0)
        },
        onKeyDown: callAllHandlers(props2.onKeyDown, onKeyDown),
        onFocus: callAllHandlers(props2.onFocus, () => setFocused(true)),
        onBlur: callAllHandlers(props2.onBlur, () => setFocused(false))
      };
    },
    [
      isInteractive,
      thumbId,
      isDragging,
      valueText,
      min,
      max,
      value,
      orientation,
      isDisabled,
      isReadOnly,
      ariaLabel,
      ariaLabelledBy,
      getThumbStyle,
      onKeyDown
    ]
  );
  const getMarkerProps = (0, import_react.useCallback)(
    (props2, ref = null) => {
      const isInRange = !(props2.value < min || props2.value > max);
      const isHighlighted = value >= props2.value;
      const markerPercent = (0, import_number_utils.valueToPercent)(props2.value, min, max);
      const markerStyle = {
        position: "absolute",
        pointerEvents: "none",
        ...orient2({
          orientation,
          vertical: {
            bottom: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`
          },
          horizontal: {
            left: isReversed ? `${100 - markerPercent}%` : `${markerPercent}%`
          }
        })
      };
      return {
        ...props2,
        ref,
        role: "presentation",
        "aria-hidden": true,
        "data-disabled": dataAttr(isDisabled),
        "data-invalid": dataAttr(!isInRange),
        "data-highlighted": dataAttr(isHighlighted),
        style: {
          ...props2.style,
          ...markerStyle
        }
      };
    },
    [isDisabled, isReversed, max, min, orientation, value]
  );
  const getInputProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref,
        type: "hidden",
        value,
        name
      };
    },
    [name, value]
  );
  const state = { value, isFocused, isDragging };
  return {
    state,
    actions,
    getRootProps,
    getTrackProps,
    getInnerTrackProps,
    getThumbProps,
    getMarkerProps,
    getInputProps
  };
}
function orient2(options) {
  const { orientation, vertical, horizontal } = options;
  return orientation === "vertical" ? vertical : horizontal;
}
function getDefaultValue(min, max) {
  return max < min ? min : min + (max - min) / 2;
}

// src/slider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var [SliderProvider, useSliderContext] = (0, import_react_context.createContext)({
  name: "SliderContext",
  hookName: "useSliderContext",
  providerName: "<Slider />"
});
var [SliderStylesProvider, useSliderStyles] = (0, import_react_context.createContext)({
  name: `SliderStylesContext`,
  hookName: `useSliderStyles`,
  providerName: "<Slider />"
});
var Slider = (0, import_system.forwardRef)((props, ref) => {
  var _a;
  const sliderProps = {
    ...props,
    orientation: (_a = props == null ? void 0 : props.orientation) != null ? _a : "horizontal"
  };
  const styles = (0, import_system.useMultiStyleConfig)("Slider", sliderProps);
  const ownProps = (0, import_system.omitThemingProps)(sliderProps);
  const { direction } = (0, import_system.useTheme)();
  ownProps.direction = direction;
  const { getInputProps, getRootProps, ...context } = useSlider(ownProps);
  const rootProps = getRootProps();
  const inputProps = getInputProps({}, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderProvider, { value: context, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_system.chakra.div,
    {
      ...rootProps,
      className: cx("chakra-slider", sliderProps.className),
      __css: styles.container,
      children: [
        sliderProps.children,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ...inputProps })
      ]
    }
  ) }) });
});
Slider.displayName = "Slider";
var SliderThumb = (0, import_system.forwardRef)((props, ref) => {
  const { getThumbProps } = useSliderContext();
  const styles = useSliderStyles();
  const thumbProps = getThumbProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...thumbProps,
      className: cx("chakra-slider__thumb", props.className),
      __css: styles.thumb
    }
  );
});
SliderThumb.displayName = "SliderThumb";
var SliderTrack = (0, import_system.forwardRef)((props, ref) => {
  const { getTrackProps } = useSliderContext();
  const styles = useSliderStyles();
  const trackProps = getTrackProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...trackProps,
      className: cx("chakra-slider__track", props.className),
      __css: styles.track
    }
  );
});
SliderTrack.displayName = "SliderTrack";
var SliderFilledTrack = (0, import_system.forwardRef)(
  (props, ref) => {
    const { getInnerTrackProps } = useSliderContext();
    const styles = useSliderStyles();
    const trackProps = getInnerTrackProps(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ...trackProps,
        className: cx("chakra-slider__filled-track", props.className),
        __css: styles.filledTrack
      }
    );
  }
);
SliderFilledTrack.displayName = "SliderFilledTrack";
var SliderMark = (0, import_system.forwardRef)((props, ref) => {
  const { getMarkerProps } = useSliderContext();
  const styles = useSliderStyles();
  const markProps = getMarkerProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...markProps,
      className: cx("chakra-slider__marker", props.className),
      __css: styles.mark
    }
  );
});
SliderMark.displayName = "SliderMark";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderProvider,
  SliderThumb,
  SliderTrack,
  useSliderContext,
  useSliderStyles
});
//# sourceMappingURL=slider.js.map