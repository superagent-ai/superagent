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

// src/number-input.tsx
var number_input_exports = {};
__export(number_input_exports, {
  NumberDecrementStepper: () => NumberDecrementStepper,
  NumberIncrementStepper: () => NumberIncrementStepper,
  NumberInput: () => NumberInput,
  NumberInputField: () => NumberInputField,
  NumberInputStepper: () => NumberInputStepper,
  StyledStepper: () => StyledStepper,
  useNumberInputStyles: () => useNumberInputStyles
});
module.exports = __toCommonJS(number_input_exports);
var import_form_control = require("@chakra-ui/form-control");
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react4 = require("react");

// src/icons.tsx
var import_icon = require("@chakra-ui/icon");
var import_jsx_runtime = require("react/jsx-runtime");
var TriangleDownIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"
  }
) });
var TriangleUpIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"
  }
) });

// src/use-number-input.ts
var import_counter = require("@chakra-ui/counter");
var import_react_use_event_listener = require("@chakra-ui/react-use-event-listener");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react3 = require("react");

// src/use-attr-observer.ts
var import_react = require("react");
function useAttributeObserver(ref, attributes, fn, enabled) {
  (0, import_react.useEffect)(() => {
    var _a;
    if (!ref.current || !enabled)
      return;
    const win = (_a = ref.current.ownerDocument.defaultView) != null ? _a : window;
    const attrs = Array.isArray(attributes) ? attributes : [attributes];
    const obs = new win.MutationObserver((changes) => {
      for (const change of changes) {
        if (change.type === "attributes" && change.attributeName && attrs.includes(change.attributeName)) {
          fn(change);
        }
      }
    });
    obs.observe(ref.current, { attributes: true, attributeFilter: attrs });
    return () => obs.disconnect();
  });
}

// src/use-spinner.ts
var import_react_use_interval = require("@chakra-ui/react-use-interval");
var import_react2 = require("react");
var CONTINUOUS_CHANGE_INTERVAL = 50;
var CONTINUOUS_CHANGE_DELAY = 300;
function useSpinner(increment, decrement) {
  const [isSpinning, setIsSpinning] = (0, import_react2.useState)(false);
  const [action, setAction] = (0, import_react2.useState)(null);
  const [runOnce, setRunOnce] = (0, import_react2.useState)(true);
  const timeoutRef = (0, import_react2.useRef)(null);
  const removeTimeout = () => clearTimeout(timeoutRef.current);
  (0, import_react_use_interval.useInterval)(
    () => {
      if (action === "increment") {
        increment();
      }
      if (action === "decrement") {
        decrement();
      }
    },
    isSpinning ? CONTINUOUS_CHANGE_INTERVAL : null
  );
  const up = (0, import_react2.useCallback)(() => {
    if (runOnce) {
      increment();
    }
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction("increment");
    }, CONTINUOUS_CHANGE_DELAY);
  }, [increment, runOnce]);
  const down = (0, import_react2.useCallback)(() => {
    if (runOnce) {
      decrement();
    }
    timeoutRef.current = setTimeout(() => {
      setRunOnce(false);
      setIsSpinning(true);
      setAction("decrement");
    }, CONTINUOUS_CHANGE_DELAY);
  }, [decrement, runOnce]);
  const stop = (0, import_react2.useCallback)(() => {
    setRunOnce(true);
    setIsSpinning(false);
    removeTimeout();
  }, []);
  (0, import_react2.useEffect)(() => {
    return () => removeTimeout();
  }, []);
  return { up, down, stop, isSpinning };
}

// src/use-number-input.ts
var FLOATING_POINT_REGEX = /^[Ee0-9+\-.]$/;
function isFloatingPointNumericCharacter(character) {
  return FLOATING_POINT_REGEX.test(character);
}
function isValidNumericKeyboardEvent(event, isValid) {
  if (event.key == null)
    return true;
  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
  const isSingleCharacterKey = event.key.length === 1;
  if (!isSingleCharacterKey || isModifierKey)
    return true;
  return isValid(event.key);
}
function useNumberInput(props = {}) {
  const {
    focusInputOnChange = true,
    clampValueOnBlur = true,
    keepWithinRange = true,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    step: stepProp = 1,
    isReadOnly,
    isDisabled,
    isRequired,
    isInvalid,
    pattern = "[0-9]*(.[0-9]+)?",
    inputMode = "decimal",
    allowMouseWheel,
    id,
    onChange: _,
    precision,
    name,
    "aria-describedby": ariaDescBy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onInvalid: onInvalidProp,
    getAriaValueText: getAriaValueTextProp,
    isValidCharacter: isValidCharacterProp,
    format: formatValue,
    parse: parseValue,
    ...htmlProps
  } = props;
  const onFocus = (0, import_react_use_callback_ref.useCallbackRef)(onFocusProp);
  const onBlur = (0, import_react_use_callback_ref.useCallbackRef)(onBlurProp);
  const onInvalid = (0, import_react_use_callback_ref.useCallbackRef)(onInvalidProp);
  const isValidCharacter = (0, import_react_use_callback_ref.useCallbackRef)(
    isValidCharacterProp != null ? isValidCharacterProp : isFloatingPointNumericCharacter
  );
  const getAriaValueText = (0, import_react_use_callback_ref.useCallbackRef)(getAriaValueTextProp);
  const counter = (0, import_counter.useCounter)(props);
  const {
    update: updateFn,
    increment: incrementFn,
    decrement: decrementFn
  } = counter;
  const [isFocused, setFocused] = (0, import_react3.useState)(false);
  const isInteractive = !(isReadOnly || isDisabled);
  const inputRef = (0, import_react3.useRef)(null);
  const inputSelectionRef = (0, import_react3.useRef)(null);
  const incrementButtonRef = (0, import_react3.useRef)(null);
  const decrementButtonRef = (0, import_react3.useRef)(null);
  const sanitize = (0, import_react3.useCallback)(
    (value) => value.split("").filter(isValidCharacter).join(""),
    [isValidCharacter]
  );
  const parse = (0, import_react3.useCallback)(
    (value) => {
      var _a;
      return (_a = parseValue == null ? void 0 : parseValue(value)) != null ? _a : value;
    },
    [parseValue]
  );
  const format = (0, import_react3.useCallback)(
    (value) => {
      var _a;
      return ((_a = formatValue == null ? void 0 : formatValue(value)) != null ? _a : value).toString();
    },
    [formatValue]
  );
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    if (counter.valueAsNumber > max) {
      onInvalid == null ? void 0 : onInvalid("rangeOverflow", format(counter.value), counter.valueAsNumber);
    } else if (counter.valueAsNumber < min) {
      onInvalid == null ? void 0 : onInvalid("rangeOverflow", format(counter.value), counter.valueAsNumber);
    }
  }, [counter.valueAsNumber, counter.value, format, onInvalid]);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!inputRef.current)
      return;
    const notInSync = inputRef.current.value != counter.value;
    if (notInSync) {
      const parsedInput = parse(inputRef.current.value);
      counter.setValue(sanitize(parsedInput));
    }
  }, [parse, sanitize]);
  const increment = (0, import_react3.useCallback)(
    (step = stepProp) => {
      if (isInteractive) {
        incrementFn(step);
      }
    },
    [incrementFn, isInteractive, stepProp]
  );
  const decrement = (0, import_react3.useCallback)(
    (step = stepProp) => {
      if (isInteractive) {
        decrementFn(step);
      }
    },
    [decrementFn, isInteractive, stepProp]
  );
  const spinner = useSpinner(increment, decrement);
  useAttributeObserver(
    incrementButtonRef,
    "disabled",
    spinner.stop,
    spinner.isSpinning
  );
  useAttributeObserver(
    decrementButtonRef,
    "disabled",
    spinner.stop,
    spinner.isSpinning
  );
  const onChange = (0, import_react3.useCallback)(
    (event) => {
      const evt = event.nativeEvent;
      if (evt.isComposing)
        return;
      const parsedInput = parse(event.currentTarget.value);
      updateFn(sanitize(parsedInput));
      inputSelectionRef.current = {
        start: event.currentTarget.selectionStart,
        end: event.currentTarget.selectionEnd
      };
    },
    [updateFn, sanitize, parse]
  );
  const _onFocus = (0, import_react3.useCallback)(
    (event) => {
      var _a, _b, _c;
      onFocus == null ? void 0 : onFocus(event);
      if (!inputSelectionRef.current)
        return;
      event.target.selectionStart = (_b = inputSelectionRef.current.start) != null ? _b : (_a = event.currentTarget.value) == null ? void 0 : _a.length;
      event.currentTarget.selectionEnd = (_c = inputSelectionRef.current.end) != null ? _c : event.currentTarget.selectionStart;
    },
    [onFocus]
  );
  const onKeyDown = (0, import_react3.useCallback)(
    (event) => {
      if (event.nativeEvent.isComposing)
        return;
      if (!isValidNumericKeyboardEvent(event, isValidCharacter)) {
        event.preventDefault();
      }
      const stepFactor = getStepFactor(event) * stepProp;
      const eventKey = event.key;
      const keyMap = {
        ArrowUp: () => increment(stepFactor),
        ArrowDown: () => decrement(stepFactor),
        Home: () => updateFn(min),
        End: () => updateFn(max)
      };
      const action = keyMap[eventKey];
      if (action) {
        event.preventDefault();
        action(event);
      }
    },
    [isValidCharacter, stepProp, increment, decrement, updateFn, min, max]
  );
  const getStepFactor = (event) => {
    let ratio = 1;
    if (event.metaKey || event.ctrlKey) {
      ratio = 0.1;
    }
    if (event.shiftKey) {
      ratio = 10;
    }
    return ratio;
  };
  const ariaValueText = (0, import_react3.useMemo)(() => {
    const text = getAriaValueText == null ? void 0 : getAriaValueText(counter.value);
    if (text != null)
      return text;
    const defaultText = counter.value.toString();
    return !defaultText ? void 0 : defaultText;
  }, [counter.value, getAriaValueText]);
  const validateAndClamp = (0, import_react3.useCallback)(() => {
    let next = counter.value;
    if (counter.value === "")
      return;
    const valueStartsWithE = /^[eE]/.test(counter.value.toString());
    if (valueStartsWithE) {
      counter.setValue("");
    } else {
      if (counter.valueAsNumber < min) {
        next = min;
      }
      if (counter.valueAsNumber > max) {
        next = max;
      }
      counter.cast(next);
    }
  }, [counter, max, min]);
  const onInputBlur = (0, import_react3.useCallback)(() => {
    setFocused(false);
    if (clampValueOnBlur) {
      validateAndClamp();
    }
  }, [clampValueOnBlur, setFocused, validateAndClamp]);
  const focusInput = (0, import_react3.useCallback)(() => {
    if (focusInputOnChange) {
      requestAnimationFrame(() => {
        var _a;
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      });
    }
  }, [focusInputOnChange]);
  const spinUp = (0, import_react3.useCallback)(
    (event) => {
      event.preventDefault();
      spinner.up();
      focusInput();
    },
    [focusInput, spinner]
  );
  const spinDown = (0, import_react3.useCallback)(
    (event) => {
      event.preventDefault();
      spinner.down();
      focusInput();
    },
    [focusInput, spinner]
  );
  (0, import_react_use_event_listener.useEventListener)(
    () => inputRef.current,
    "wheel",
    (event) => {
      var _a, _b;
      const doc = (_b = (_a = inputRef.current) == null ? void 0 : _a.ownerDocument) != null ? _b : document;
      const isInputFocused = doc.activeElement === inputRef.current;
      if (!allowMouseWheel || !isInputFocused)
        return;
      event.preventDefault();
      const stepFactor = getStepFactor(event) * stepProp;
      const direction = Math.sign(event.deltaY);
      if (direction === -1) {
        increment(stepFactor);
      } else if (direction === 1) {
        decrement(stepFactor);
      }
    },
    { passive: false }
  );
  const getIncrementButtonProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      const disabled = isDisabled || keepWithinRange && counter.isAtMax;
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, incrementButtonRef),
        role: "button",
        tabIndex: -1,
        onPointerDown: (0, import_shared_utils.callAllHandlers)(props2.onPointerDown, (event) => {
          if (event.button !== 0 || disabled)
            return;
          spinUp(event);
        }),
        onPointerLeave: (0, import_shared_utils.callAllHandlers)(props2.onPointerLeave, spinner.stop),
        onPointerUp: (0, import_shared_utils.callAllHandlers)(props2.onPointerUp, spinner.stop),
        disabled,
        "aria-disabled": (0, import_shared_utils.ariaAttr)(disabled)
      };
    },
    [counter.isAtMax, keepWithinRange, spinUp, spinner.stop, isDisabled]
  );
  const getDecrementButtonProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      const disabled = isDisabled || keepWithinRange && counter.isAtMin;
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(ref, decrementButtonRef),
        role: "button",
        tabIndex: -1,
        onPointerDown: (0, import_shared_utils.callAllHandlers)(props2.onPointerDown, (event) => {
          if (event.button !== 0 || disabled)
            return;
          spinDown(event);
        }),
        onPointerLeave: (0, import_shared_utils.callAllHandlers)(props2.onPointerLeave, spinner.stop),
        onPointerUp: (0, import_shared_utils.callAllHandlers)(props2.onPointerUp, spinner.stop),
        disabled,
        "aria-disabled": (0, import_shared_utils.ariaAttr)(disabled)
      };
    },
    [counter.isAtMin, keepWithinRange, spinDown, spinner.stop, isDisabled]
  );
  const getInputProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      var _a, _b, _c, _d;
      return {
        name,
        inputMode,
        type: "text",
        pattern,
        "aria-labelledby": ariaLabelledBy,
        "aria-label": ariaLabel,
        "aria-describedby": ariaDescBy,
        id,
        disabled: isDisabled,
        ...props2,
        readOnly: (_a = props2.readOnly) != null ? _a : isReadOnly,
        "aria-readonly": (_b = props2.readOnly) != null ? _b : isReadOnly,
        "aria-required": (_c = props2.required) != null ? _c : isRequired,
        required: (_d = props2.required) != null ? _d : isRequired,
        ref: (0, import_react_use_merge_refs.mergeRefs)(inputRef, ref),
        value: format(counter.value),
        role: "spinbutton",
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": Number.isNaN(counter.valueAsNumber) ? void 0 : counter.valueAsNumber,
        "aria-invalid": (0, import_shared_utils.ariaAttr)(isInvalid != null ? isInvalid : counter.isOutOfRange),
        "aria-valuetext": ariaValueText,
        autoComplete: "off",
        autoCorrect: "off",
        onChange: (0, import_shared_utils.callAllHandlers)(props2.onChange, onChange),
        onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDown),
        onFocus: (0, import_shared_utils.callAllHandlers)(
          props2.onFocus,
          _onFocus,
          () => setFocused(true)
        ),
        onBlur: (0, import_shared_utils.callAllHandlers)(props2.onBlur, onBlur, onInputBlur)
      };
    },
    [
      name,
      inputMode,
      pattern,
      ariaLabelledBy,
      ariaLabel,
      format,
      ariaDescBy,
      id,
      isDisabled,
      isRequired,
      isReadOnly,
      isInvalid,
      counter.value,
      counter.valueAsNumber,
      counter.isOutOfRange,
      min,
      max,
      ariaValueText,
      onChange,
      onKeyDown,
      _onFocus,
      onBlur,
      onInputBlur
    ]
  );
  return {
    value: format(counter.value),
    valueAsNumber: counter.valueAsNumber,
    isFocused,
    isDisabled,
    isReadOnly,
    getIncrementButtonProps,
    getDecrementButtonProps,
    getInputProps,
    htmlProps
  };
}

// src/number-input.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var [NumberInputStylesProvider, useNumberInputStyles] = (0, import_react_context.createContext)({
  name: `NumberInputStylesContext`,
  errorMessage: `useNumberInputStyles returned is 'undefined'. Seems you forgot to wrap the components in "<NumberInput />" `
});
var [NumberInputProvider, useNumberInputContext] = (0, import_react_context.createContext)({
  name: "NumberInputContext",
  errorMessage: "useNumberInputContext: `context` is undefined. Seems you forgot to wrap number-input's components within <NumberInput />"
});
var NumberInput = (0, import_system.forwardRef)(
  function NumberInput2(props, ref) {
    const styles = (0, import_system.useMultiStyleConfig)("NumberInput", props);
    const ownProps = (0, import_system.omitThemingProps)(props);
    const controlProps = (0, import_form_control.useFormControlProps)(ownProps);
    const { htmlProps, ...context } = useNumberInput(controlProps);
    const ctx = (0, import_react4.useMemo)(() => context, [context]);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberInputProvider, { value: ctx, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NumberInputStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system.chakra.div,
      {
        ...htmlProps,
        ref,
        className: (0, import_shared_utils2.cx)("chakra-numberinput", props.className),
        __css: {
          position: "relative",
          zIndex: 0,
          ...styles.root
        }
      }
    ) }) });
  }
);
NumberInput.displayName = "NumberInput";
var NumberInputStepper = (0, import_system.forwardRef)(
  function NumberInputStepper2(props, ref) {
    const styles = useNumberInputStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system.chakra.div,
      {
        "aria-hidden": true,
        ref,
        ...props,
        __css: {
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "0",
          insetEnd: "0px",
          margin: "1px",
          height: "calc(100% - 2px)",
          zIndex: 1,
          ...styles.stepperGroup
        }
      }
    );
  }
);
NumberInputStepper.displayName = "NumberInputStepper";
var NumberInputField = (0, import_system.forwardRef)(
  function NumberInputField2(props, ref) {
    const { getInputProps } = useNumberInputContext();
    const input = getInputProps(props, ref);
    const styles = useNumberInputStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system.chakra.input,
      {
        ...input,
        className: (0, import_shared_utils2.cx)("chakra-numberinput__field", props.className),
        __css: {
          width: "100%",
          ...styles.field
        }
      }
    );
  }
);
NumberInputField.displayName = "NumberInputField";
var StyledStepper = (0, import_system.chakra)("div", {
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    transitionProperty: "common",
    transitionDuration: "normal",
    userSelect: "none",
    cursor: "pointer",
    lineHeight: "normal"
  }
});
var NumberDecrementStepper = (0, import_system.forwardRef)(function NumberDecrementStepper2(props, ref) {
  var _a;
  const styles = useNumberInputStyles();
  const { getDecrementButtonProps } = useNumberInputContext();
  const decrement = getDecrementButtonProps(props, ref);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StyledStepper, { ...decrement, __css: styles.stepper, children: (_a = props.children) != null ? _a : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TriangleDownIcon, {}) });
});
NumberDecrementStepper.displayName = "NumberDecrementStepper";
var NumberIncrementStepper = (0, import_system.forwardRef)(function NumberIncrementStepper2(props, ref) {
  var _a;
  const { getIncrementButtonProps } = useNumberInputContext();
  const increment = getIncrementButtonProps(props, ref);
  const styles = useNumberInputStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StyledStepper, { ...increment, __css: styles.stepper, children: (_a = props.children) != null ? _a : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TriangleUpIcon, {}) });
});
NumberIncrementStepper.displayName = "NumberIncrementStepper";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  StyledStepper,
  useNumberInputStyles
});
//# sourceMappingURL=number-input.js.map