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
  RangeSlider: () => RangeSlider,
  RangeSliderFilledTrack: () => RangeSliderFilledTrack,
  RangeSliderMark: () => RangeSliderMark,
  RangeSliderProvider: () => RangeSliderProvider,
  RangeSliderThumb: () => RangeSliderThumb,
  RangeSliderTrack: () => RangeSliderTrack,
  Slider: () => Slider,
  SliderFilledTrack: () => SliderFilledTrack,
  SliderMark: () => SliderMark,
  SliderProvider: () => SliderProvider,
  SliderThumb: () => SliderThumb,
  SliderTrack: () => SliderTrack,
  useRangeSlider: () => useRangeSlider,
  useRangeSliderContext: () => useRangeSliderContext,
  useRangeSliderStyles: () => useRangeSliderStyles,
  useSlider: () => useSlider,
  useSliderContext: () => useSliderContext,
  useSliderStyles: () => useSliderStyles
});
module.exports = __toCommonJS(src_exports);

// src/range-slider.tsx
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

// src/range-slider.tsx
var import_react2 = require("react");

// src/use-range-slider.ts
var import_react_use_pan_event = require("@chakra-ui/react-use-pan-event");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_number_utils = require("@chakra-ui/number-utils");
var import_react = require("react");

// src/slider-utils.ts
function getIds(id) {
  return {
    root: `slider-root-${id}`,
    getThumb: (i) => `slider-thumb-${id}-${i}`,
    getInput: (i) => `slider-input-${id}-${i}`,
    track: `slider-track-${id}`,
    innerTrack: `slider-filled-track-${id}`,
    getMarker: (i) => `slider-marker-${id}-${i}`,
    output: `slider-output-${id}`
  };
}
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

// src/use-range-slider.ts
var import_react_use_size = require("@chakra-ui/react-use-size");
function useRangeSlider(props) {
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
    minStepsBetweenThumbs = 0,
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
  const [valueState, setValue] = (0, import_react_use_controllable_state.useControllableState)({
    value: valueProp,
    defaultValue: defaultValue != null ? defaultValue : [25, 75],
    onChange
  });
  if (!Array.isArray(valueState)) {
    throw new TypeError(
      `[range-slider] You passed an invalid value for \`value\` or \`defaultValue\`, expected \`Array\` but got \`${typeof valueState}\``
    );
  }
  const [isDragging, setDragging] = (0, import_react.useState)(false);
  const [isFocused, setFocused] = (0, import_react.useState)(false);
  const [activeIndex, setActiveIndex] = (0, import_react.useState)(-1);
  const isInteractive = !(isDisabled || isReadOnly);
  const initialValue = (0, import_react.useRef)(valueState);
  const value = valueState.map((val) => (0, import_number_utils.clampValue)(val, min, max));
  const spacing = minStepsBetweenThumbs * step;
  const valueBounds = getValueBounds(value, min, max, spacing);
  const stateRef = (0, import_react.useRef)({
    eventSource: null,
    value: [],
    valueBounds: []
  });
  stateRef.current.value = value;
  stateRef.current.valueBounds = valueBounds;
  const reversedValue = value.map((val) => max - val + min);
  const thumbValues = isReversed ? reversedValue : value;
  const thumbPercents = thumbValues.map((val) => (0, import_number_utils.valueToPercent)(val, min, max));
  const isVertical = orientation === "vertical";
  const trackRef = (0, import_react.useRef)(null);
  const rootRef = (0, import_react.useRef)(null);
  const thumbRects = (0, import_react_use_size.useSizes)({
    getNodes() {
      const rootNode = rootRef.current;
      const thumbNodes = rootNode == null ? void 0 : rootNode.querySelectorAll("[role=slider]");
      return thumbNodes ? Array.from(thumbNodes) : [];
    }
  });
  const reactId = (0, import_react.useId)();
  const uuid = idProp != null ? idProp : reactId;
  const ids = getIds(uuid);
  const getValueFromPointer = (0, import_react.useCallback)(
    (event) => {
      var _a, _b;
      if (!trackRef.current)
        return;
      stateRef.current.eventSource = "pointer";
      const rect = trackRef.current.getBoundingClientRect();
      const { clientX, clientY } = (_b = (_a = event.touches) == null ? void 0 : _a[0]) != null ? _b : event;
      const diff = isVertical ? rect.bottom - clientY : clientX - rect.left;
      const length = isVertical ? rect.height : rect.width;
      let percent = diff / length;
      if (isReversed)
        percent = 1 - percent;
      return (0, import_number_utils.percentToValue)(percent, min, max);
    },
    [isVertical, isReversed, max, min]
  );
  const tenSteps = (max - min) / 10;
  const oneStep = step || (max - min) / 100;
  const actions = (0, import_react.useMemo)(
    () => ({
      setValueAtIndex(index, val) {
        if (!isInteractive)
          return;
        const bounds = stateRef.current.valueBounds[index];
        val = parseFloat((0, import_number_utils.roundValueToStep)(val, bounds.min, oneStep));
        val = (0, import_number_utils.clampValue)(val, bounds.min, bounds.max);
        const next = [...stateRef.current.value];
        next[index] = val;
        setValue(next);
      },
      setActiveIndex,
      stepUp(index, step2 = oneStep) {
        const valueAtIndex = stateRef.current.value[index];
        const next = isReversed ? valueAtIndex - step2 : valueAtIndex + step2;
        actions.setValueAtIndex(index, next);
      },
      stepDown(index, step2 = oneStep) {
        const valueAtIndex = stateRef.current.value[index];
        const next = isReversed ? valueAtIndex + step2 : valueAtIndex - step2;
        actions.setValueAtIndex(index, next);
      },
      reset() {
        setValue(initialValue.current);
      }
    }),
    [oneStep, isReversed, setValue, isInteractive]
  );
  const onKeyDown = (0, import_react.useCallback)(
    (event) => {
      const eventKey = event.key;
      const keyMap = {
        ArrowRight: () => actions.stepUp(activeIndex),
        ArrowUp: () => actions.stepUp(activeIndex),
        ArrowLeft: () => actions.stepDown(activeIndex),
        ArrowDown: () => actions.stepDown(activeIndex),
        PageUp: () => actions.stepUp(activeIndex, tenSteps),
        PageDown: () => actions.stepDown(activeIndex, tenSteps),
        Home: () => {
          const { min: value2 } = valueBounds[activeIndex];
          actions.setValueAtIndex(activeIndex, value2);
        },
        End: () => {
          const { max: value2 } = valueBounds[activeIndex];
          actions.setValueAtIndex(activeIndex, value2);
        }
      };
      const action = keyMap[eventKey];
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        action(event);
        stateRef.current.eventSource = "keyboard";
      }
    },
    [actions, activeIndex, tenSteps, valueBounds]
  );
  const { getThumbStyle, rootStyle, trackStyle, innerTrackStyle } = (0, import_react.useMemo)(
    () => getStyles({
      isReversed,
      orientation,
      thumbRects,
      thumbPercents
    }),
    [isReversed, orientation, thumbPercents, thumbRects]
  );
  const focusThumb = (0, import_react.useCallback)(
    (index) => {
      var _a;
      const idx = index != null ? index : activeIndex;
      if (idx !== -1 && focusThumbOnChange) {
        const id = ids.getThumb(idx);
        const thumb = (_a = rootRef.current) == null ? void 0 : _a.ownerDocument.getElementById(id);
        if (thumb) {
          setTimeout(() => thumb.focus());
        }
      }
    },
    [focusThumbOnChange, activeIndex, ids]
  );
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    if (stateRef.current.eventSource === "keyboard") {
      onChangeEnd == null ? void 0 : onChangeEnd(stateRef.current.value);
    }
  }, [value, onChangeEnd]);
  const onPanSessionStart = (event) => {
    const pointValue = getValueFromPointer(event) || 0;
    const distances = stateRef.current.value.map(
      (val) => Math.abs(val - pointValue)
    );
    const closest = Math.min(...distances);
    let index = distances.indexOf(closest);
    const thumbsAtPosition = distances.filter(
      (distance) => distance === closest
    );
    const isThumbStacked = thumbsAtPosition.length > 1;
    if (isThumbStacked && pointValue > stateRef.current.value[index]) {
      index = index + thumbsAtPosition.length - 1;
    }
    setActiveIndex(index);
    actions.setValueAtIndex(index, pointValue);
    focusThumb(index);
  };
  const onPan = (event) => {
    if (activeIndex == -1)
      return;
    const pointValue = getValueFromPointer(event) || 0;
    setActiveIndex(activeIndex);
    actions.setValueAtIndex(activeIndex, pointValue);
    focusThumb(activeIndex);
  };
  (0, import_react_use_pan_event.usePanEvent)(rootRef, {
    onPanSessionStart(event) {
      if (!isInteractive)
        return;
      setDragging(true);
      onPanSessionStart(event);
      onChangeStart == null ? void 0 : onChangeStart(stateRef.current.value);
    },
    onPanSessionEnd() {
      if (!isInteractive)
        return;
      setDragging(false);
      onChangeEnd == null ? void 0 : onChangeEnd(stateRef.current.value);
    },
    onPan(event) {
      if (!isInteractive)
        return;
      onPan(event);
    }
  });
  const getRootProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ...htmlProps,
        id: ids.root,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, rootRef),
        tabIndex: -1,
        "aria-disabled": ariaAttr(isDisabled),
        "data-focused": dataAttr(isFocused),
        style: { ...props2.style, ...rootStyle }
      };
    },
    [htmlProps, isDisabled, isFocused, rootStyle, ids]
  );
  const getTrackProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, trackRef),
        id: ids.track,
        "data-disabled": dataAttr(isDisabled),
        style: { ...props2.style, ...trackStyle }
      };
    },
    [isDisabled, trackStyle, ids]
  );
  const getInnerTrackProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref,
        id: ids.innerTrack,
        style: {
          ...props2.style,
          ...innerTrackStyle
        }
      };
    },
    [innerTrackStyle, ids]
  );
  const getThumbProps = (0, import_react.useCallback)(
    (props2, ref = null) => {
      var _a;
      const { index, ...rest } = props2;
      const valueAtIndex = value[index];
      if (valueAtIndex == null) {
        throw new TypeError(
          `[range-slider > thumb] Cannot find value at index \`${index}\`. The \`value\` or \`defaultValue\` length is : ${value.length}`
        );
      }
      const bounds = valueBounds[index];
      return {
        ...rest,
        ref,
        role: "slider",
        tabIndex: isInteractive ? 0 : void 0,
        id: ids.getThumb(index),
        "data-active": dataAttr(isDragging && activeIndex === index),
        "aria-valuetext": (_a = getAriaValueText == null ? void 0 : getAriaValueText(valueAtIndex)) != null ? _a : ariaValueText == null ? void 0 : ariaValueText[index],
        "aria-valuemin": bounds.min,
        "aria-valuemax": bounds.max,
        "aria-valuenow": valueAtIndex,
        "aria-orientation": orientation,
        "aria-disabled": ariaAttr(isDisabled),
        "aria-readonly": ariaAttr(isReadOnly),
        "aria-label": ariaLabel == null ? void 0 : ariaLabel[index],
        "aria-labelledby": (ariaLabel == null ? void 0 : ariaLabel[index]) ? void 0 : ariaLabelledBy == null ? void 0 : ariaLabelledBy[index],
        style: { ...props2.style, ...getThumbStyle(index) },
        onKeyDown: callAllHandlers(props2.onKeyDown, onKeyDown),
        onFocus: callAllHandlers(props2.onFocus, () => {
          setFocused(true);
          setActiveIndex(index);
        }),
        onBlur: callAllHandlers(props2.onBlur, () => {
          setFocused(false);
          setActiveIndex(-1);
        })
      };
    },
    [
      ids,
      value,
      valueBounds,
      isInteractive,
      isDragging,
      activeIndex,
      getAriaValueText,
      ariaValueText,
      orientation,
      isDisabled,
      isReadOnly,
      ariaLabel,
      ariaLabelledBy,
      getThumbStyle,
      onKeyDown,
      setFocused
    ]
  );
  const getOutputProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref,
        id: ids.output,
        htmlFor: value.map((v, i) => ids.getThumb(i)).join(" "),
        "aria-live": "off"
      };
    },
    [ids, value]
  );
  const getMarkerProps = (0, import_react.useCallback)(
    (props2, ref = null) => {
      const { value: v, ...rest } = props2;
      const isInRange = !(v < min || v > max);
      const isHighlighted = v >= value[0] && v <= value[value.length - 1];
      let percent = (0, import_number_utils.valueToPercent)(v, min, max);
      percent = isReversed ? 100 - percent : percent;
      const markerStyle = {
        position: "absolute",
        pointerEvents: "none",
        ...orient({
          orientation,
          vertical: { bottom: `${percent}%` },
          horizontal: { left: `${percent}%` }
        })
      };
      return {
        ...rest,
        ref,
        id: ids.getMarker(props2.value),
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
    [isDisabled, isReversed, max, min, orientation, value, ids]
  );
  const getInputProps = (0, import_react.useCallback)(
    (props2, ref = null) => {
      const { index, ...rest } = props2;
      return {
        ...rest,
        ref,
        id: ids.getInput(index),
        type: "hidden",
        value: value[index],
        name: Array.isArray(name) ? name[index] : `${name}-${index}`
      };
    },
    [name, value, ids]
  );
  const state = {
    value,
    isFocused,
    isDragging,
    getThumbPercent: (index) => thumbPercents[index],
    getThumbMinValue: (index) => valueBounds[index].min,
    getThumbMaxValue: (index) => valueBounds[index].max
  };
  return {
    state,
    actions,
    getRootProps,
    getTrackProps,
    getInnerTrackProps,
    getThumbProps,
    getMarkerProps,
    getInputProps,
    getOutputProps
  };
}
function getValueBounds(arr, min, max, spacing) {
  return arr.map((v, i) => {
    const _min = i === 0 ? min : arr[i - 1] + spacing;
    const _max = i === arr.length - 1 ? max : arr[i + 1] - spacing;
    return { min: _min, max: _max };
  });
}

// src/range-slider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var [RangeSliderProvider, useRangeSliderContext] = (0, import_react_context.createContext)({
  name: "SliderContext",
  errorMessage: "useSliderContext: `context` is undefined. Seems you forgot to wrap all slider components within <RangeSlider />"
});
var [RangeSliderStylesProvider, useRangeSliderStyles] = (0, import_react_context.createContext)({
  name: `RangeSliderStylesContext`,
  errorMessage: `useRangeSliderStyles returned is 'undefined'. Seems you forgot to wrap the components in "<RangeSlider />" `
});
var RangeSlider = (0, import_system.forwardRef)(
  function RangeSlider2(props, ref) {
    const sliderProps = {
      orientation: "horizontal",
      ...props
    };
    const styles = (0, import_system.useMultiStyleConfig)("Slider", sliderProps);
    const ownProps = (0, import_system.omitThemingProps)(sliderProps);
    const { direction } = (0, import_system.useTheme)();
    ownProps.direction = direction;
    const { getRootProps, ...context } = useRangeSlider(ownProps);
    const ctx = (0, import_react2.useMemo)(
      () => ({ ...context, name: sliderProps.name }),
      [context, sliderProps.name]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeSliderProvider, { value: ctx, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeSliderStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
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
var RangeSliderThumb = (0, import_system.forwardRef)(
  function RangeSliderThumb2(props, ref) {
    const { getThumbProps, getInputProps, name } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const thumbProps = getThumbProps(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_system.chakra.div,
      {
        ...thumbProps,
        className: cx("chakra-slider__thumb", props.className),
        __css: styles.thumb,
        children: [
          thumbProps.children,
          name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ...getInputProps({ index: props.index }) })
        ]
      }
    );
  }
);
RangeSliderThumb.displayName = "RangeSliderThumb";
var RangeSliderTrack = (0, import_system.forwardRef)(
  function RangeSliderTrack2(props, ref) {
    const { getTrackProps } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const trackProps = getTrackProps(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
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
var RangeSliderFilledTrack = (0, import_system.forwardRef)(function RangeSliderFilledTrack2(props, ref) {
  const { getInnerTrackProps } = useRangeSliderContext();
  const styles = useRangeSliderStyles();
  const trackProps = getInnerTrackProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...trackProps,
      className: "chakra-slider__filled-track",
      __css: styles.filledTrack
    }
  );
});
RangeSliderFilledTrack.displayName = "RangeSliderFilledTrack";
var RangeSliderMark = (0, import_system.forwardRef)(
  function RangeSliderMark2(props, ref) {
    const { getMarkerProps } = useRangeSliderContext();
    const styles = useRangeSliderStyles();
    const markProps = getMarkerProps(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ...markProps,
        className: cx("chakra-slider__marker", props.className),
        __css: styles.mark
      }
    );
  }
);
RangeSliderMark.displayName = "RangeSliderMark";

// src/slider.tsx
var import_react_context2 = require("@chakra-ui/react-context");
var import_system2 = require("@chakra-ui/system");

// src/use-slider.ts
var import_react_use_pan_event2 = require("@chakra-ui/react-use-pan-event");
var import_react_use_callback_ref2 = require("@chakra-ui/react-use-callback-ref");
var import_react_use_update_effect2 = require("@chakra-ui/react-use-update-effect");
var import_react_use_controllable_state2 = require("@chakra-ui/react-use-controllable-state");
var import_react_use_size2 = require("@chakra-ui/react-use-size");
var import_react_use_merge_refs2 = require("@chakra-ui/react-use-merge-refs");
var import_react_use_latest_ref = require("@chakra-ui/react-use-latest-ref");
var import_number_utils2 = require("@chakra-ui/number-utils");
var import_react3 = require("react");
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
  const onChangeStart = (0, import_react_use_callback_ref2.useCallbackRef)(onChangeStartProp);
  const onChangeEnd = (0, import_react_use_callback_ref2.useCallbackRef)(onChangeEndProp);
  const getAriaValueText = (0, import_react_use_callback_ref2.useCallbackRef)(getAriaValueTextProp);
  const isReversed = getIsReversed({
    isReversed: isReversedProp,
    direction,
    orientation
  });
  const [computedValue, setValue] = (0, import_react_use_controllable_state2.useControllableState)({
    value: valueProp,
    defaultValue: defaultValue != null ? defaultValue : getDefaultValue(min, max),
    onChange
  });
  const [isDragging, setDragging] = (0, import_react3.useState)(false);
  const [isFocused, setFocused] = (0, import_react3.useState)(false);
  const isInteractive = !(isDisabled || isReadOnly);
  const tenSteps = (max - min) / 10;
  const oneStep = step || (max - min) / 100;
  const value = (0, import_number_utils2.clampValue)(computedValue, min, max);
  const reversedValue = max - value + min;
  const trackValue = isReversed ? reversedValue : value;
  const thumbPercent = (0, import_number_utils2.valueToPercent)(trackValue, min, max);
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
  const trackRef = (0, import_react3.useRef)(null);
  const thumbRef = (0, import_react3.useRef)(null);
  const rootRef = (0, import_react3.useRef)(null);
  const reactId = (0, import_react3.useId)();
  const uuid = idProp != null ? idProp : reactId;
  const [thumbId, trackId] = [`slider-thumb-${uuid}`, `slider-track-${uuid}`];
  const getValueFromPointer = (0, import_react3.useCallback)(
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
      let nextValue = (0, import_number_utils2.percentToValue)(percent, state2.min, state2.max);
      if (state2.step) {
        nextValue = parseFloat(
          (0, import_number_utils2.roundValueToStep)(nextValue, state2.min, state2.step)
        );
      }
      nextValue = (0, import_number_utils2.clampValue)(nextValue, state2.min, state2.max);
      return nextValue;
    },
    [isVertical, isReversed, stateRef]
  );
  const constrain = (0, import_react3.useCallback)(
    (value2) => {
      const state2 = stateRef.current;
      if (!state2.isInteractive)
        return;
      value2 = parseFloat((0, import_number_utils2.roundValueToStep)(value2, state2.min, oneStep));
      value2 = (0, import_number_utils2.clampValue)(value2, state2.min, state2.max);
      setValue(value2);
    },
    [oneStep, setValue, stateRef]
  );
  const actions = (0, import_react3.useMemo)(
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
  const onKeyDown = (0, import_react3.useCallback)(
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
  const thumbSize = (0, import_react_use_size2.useSize)(thumbRef);
  const { getThumbStyle, rootStyle, trackStyle, innerTrackStyle } = (0, import_react3.useMemo)(() => {
    const state2 = stateRef.current;
    const thumbRect = thumbSize != null ? thumbSize : { width: 0, height: 0 };
    return getStyles({
      isReversed,
      orientation: state2.orientation,
      thumbRects: [thumbRect],
      thumbPercents: [thumbPercent]
    });
  }, [isReversed, thumbSize, thumbPercent, stateRef]);
  const focusThumb = (0, import_react3.useCallback)(() => {
    const state2 = stateRef.current;
    if (state2.focusThumbOnChange) {
      setTimeout(() => {
        var _a2;
        return (_a2 = thumbRef.current) == null ? void 0 : _a2.focus();
      });
    }
  }, [stateRef]);
  (0, import_react_use_update_effect2.useUpdateEffect)(() => {
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
  (0, import_react_use_pan_event2.usePanEvent)(rootRef, {
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
  const getRootProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ...htmlProps,
        ref: (0, import_react_use_merge_refs2.mergeRefs)(ref, rootRef),
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
  const getTrackProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs2.mergeRefs)(ref, trackRef),
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
  const getInnerTrackProps = (0, import_react3.useCallback)(
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
  const getThumbProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs2.mergeRefs)(ref, thumbRef),
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
  const getMarkerProps = (0, import_react3.useCallback)(
    (props2, ref = null) => {
      const isInRange = !(props2.value < min || props2.value > max);
      const isHighlighted = value >= props2.value;
      const markerPercent = (0, import_number_utils2.valueToPercent)(props2.value, min, max);
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
  const getInputProps = (0, import_react3.useCallback)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
var [SliderProvider, useSliderContext] = (0, import_react_context2.createContext)({
  name: "SliderContext",
  hookName: "useSliderContext",
  providerName: "<Slider />"
});
var [SliderStylesProvider, useSliderStyles] = (0, import_react_context2.createContext)({
  name: `SliderStylesContext`,
  hookName: `useSliderStyles`,
  providerName: "<Slider />"
});
var Slider = (0, import_system2.forwardRef)((props, ref) => {
  var _a;
  const sliderProps = {
    ...props,
    orientation: (_a = props == null ? void 0 : props.orientation) != null ? _a : "horizontal"
  };
  const styles = (0, import_system2.useMultiStyleConfig)("Slider", sliderProps);
  const ownProps = (0, import_system2.omitThemingProps)(sliderProps);
  const { direction } = (0, import_system2.useTheme)();
  ownProps.direction = direction;
  const { getInputProps, getRootProps, ...context } = useSlider(ownProps);
  const rootProps = getRootProps();
  const inputProps = getInputProps({}, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SliderProvider, { value: context, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SliderStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_system2.chakra.div,
    {
      ...rootProps,
      className: cx("chakra-slider", sliderProps.className),
      __css: styles.container,
      children: [
        sliderProps.children,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { ...inputProps })
      ]
    }
  ) }) });
});
Slider.displayName = "Slider";
var SliderThumb = (0, import_system2.forwardRef)((props, ref) => {
  const { getThumbProps } = useSliderContext();
  const styles = useSliderStyles();
  const thumbProps = getThumbProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.div,
    {
      ...thumbProps,
      className: cx("chakra-slider__thumb", props.className),
      __css: styles.thumb
    }
  );
});
SliderThumb.displayName = "SliderThumb";
var SliderTrack = (0, import_system2.forwardRef)((props, ref) => {
  const { getTrackProps } = useSliderContext();
  const styles = useSliderStyles();
  const trackProps = getTrackProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.div,
    {
      ...trackProps,
      className: cx("chakra-slider__track", props.className),
      __css: styles.track
    }
  );
});
SliderTrack.displayName = "SliderTrack";
var SliderFilledTrack = (0, import_system2.forwardRef)(
  (props, ref) => {
    const { getInnerTrackProps } = useSliderContext();
    const styles = useSliderStyles();
    const trackProps = getInnerTrackProps(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.div,
      {
        ...trackProps,
        className: cx("chakra-slider__filled-track", props.className),
        __css: styles.filledTrack
      }
    );
  }
);
SliderFilledTrack.displayName = "SliderFilledTrack";
var SliderMark = (0, import_system2.forwardRef)((props, ref) => {
  const { getMarkerProps } = useSliderContext();
  const styles = useSliderStyles();
  const markProps = getMarkerProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.div,
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
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderProvider,
  RangeSliderThumb,
  RangeSliderTrack,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderProvider,
  SliderThumb,
  SliderTrack,
  useRangeSlider,
  useRangeSliderContext,
  useRangeSliderStyles,
  useSlider,
  useSliderContext,
  useSliderStyles
});
//# sourceMappingURL=index.js.map