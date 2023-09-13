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
  Radio: () => Radio,
  RadioGroup: () => RadioGroup,
  useRadio: () => useRadio,
  useRadioGroup: () => useRadioGroup,
  useRadioGroupContext: () => useRadioGroupContext
});
module.exports = __toCommonJS(src_exports);

// src/radio.tsx
var import_system2 = require("@chakra-ui/system");
var import_shared_utils4 = require("@chakra-ui/shared-utils");

// ../../utilities/object-utils/src/split.ts
function split(object, keys) {
  const picked = {};
  const omitted = {};
  for (const [key, value] of Object.entries(object)) {
    if (keys.includes(key))
      picked[key] = value;
    else
      omitted[key] = value;
  }
  return [picked, omitted];
}

// src/radio-group.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react_context = require("@chakra-ui/react-context");

// src/use-radio-group.ts
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_react = require("react");
function isInputEvent(value) {
  return value && (0, import_shared_utils.isObject)(value) && (0, import_shared_utils.isObject)(value.target);
}
function useRadioGroup(props = {}) {
  const {
    onChange: onChangeProp,
    value: valueProp,
    defaultValue,
    name: nameProp,
    isDisabled,
    isFocusable,
    isNative,
    ...htmlProps
  } = props;
  const [valueState, setValue] = (0, import_react.useState)(defaultValue || "");
  const isControlled = typeof valueProp !== "undefined";
  const value = isControlled ? valueProp : valueState;
  const ref = (0, import_react.useRef)(null);
  const focus = (0, import_react.useCallback)(() => {
    const rootNode = ref.current;
    if (!rootNode)
      return;
    let query = `input:not(:disabled):checked`;
    const firstEnabledAndCheckedInput = rootNode.querySelector(
      query
    );
    if (firstEnabledAndCheckedInput) {
      firstEnabledAndCheckedInput.focus();
      return;
    }
    query = `input:not(:disabled)`;
    const firstEnabledInput = rootNode.querySelector(query);
    firstEnabledInput == null ? void 0 : firstEnabledInput.focus();
  }, []);
  const uuid = (0, import_react.useId)();
  const fallbackName = `radio-${uuid}`;
  const name = nameProp || fallbackName;
  const onChange = (0, import_react.useCallback)(
    (eventOrValue) => {
      const nextValue = isInputEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;
      if (!isControlled) {
        setValue(nextValue);
      }
      onChangeProp == null ? void 0 : onChangeProp(String(nextValue));
    },
    [onChangeProp, isControlled]
  );
  const getRootProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => ({
      ...props2,
      ref: (0, import_react_use_merge_refs.mergeRefs)(forwardedRef, ref),
      role: "radiogroup"
    }),
    []
  );
  const getRadioProps = (0, import_react.useCallback)(
    (props2 = {}, ref2 = null) => {
      const checkedKey = isNative ? "checked" : "isChecked";
      return {
        ...props2,
        ref: ref2,
        name,
        [checkedKey]: value != null ? props2.value === value : void 0,
        onChange(event) {
          onChange(event);
        },
        "data-radiogroup": true
      };
    },
    [isNative, name, onChange, value]
  );
  return {
    getRootProps,
    getRadioProps,
    name,
    ref,
    focus,
    setValue,
    value,
    onChange,
    isDisabled,
    isFocusable,
    htmlProps
  };
}

// src/radio-group.tsx
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var [RadioGroupProvider, useRadioGroupContext] = (0, import_react_context.createContext)({
  name: "RadioGroupContext",
  strict: false
});
var RadioGroup = (0, import_system.forwardRef)((props, ref) => {
  const {
    colorScheme,
    size,
    variant,
    children,
    className,
    isDisabled,
    isFocusable,
    ...rest
  } = props;
  const { value, onChange, getRootProps, name, htmlProps } = useRadioGroup(rest);
  const group = (0, import_react2.useMemo)(
    () => ({
      name,
      size,
      onChange,
      colorScheme,
      value,
      variant,
      isDisabled,
      isFocusable
    }),
    [
      name,
      size,
      onChange,
      colorScheme,
      value,
      variant,
      isDisabled,
      isFocusable
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupProvider, { value: group, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...getRootProps(htmlProps, ref),
      className: (0, import_shared_utils2.cx)("chakra-radio-group", className),
      children
    }
  ) });
});
RadioGroup.displayName = "RadioGroup";

// src/use-radio.ts
var import_form_control = require("@chakra-ui/form-control");
var import_shared_utils3 = require("@chakra-ui/shared-utils");

// ../visually-hidden/src/visually-hidden.style.ts
var visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0, 0, 0, 0)",
  height: "1px",
  width: "1px",
  margin: "-1px",
  padding: "0",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute"
};

// src/use-radio.ts
var import_focus_visible = require("@zag-js/focus-visible");
var import_react3 = require("react");
function useRadio(props = {}) {
  const {
    defaultChecked,
    isChecked: isCheckedProp,
    isFocusable,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    isRequired: isRequiredProp,
    onChange,
    isInvalid: isInvalidProp,
    name,
    value,
    id: idProp,
    "data-radiogroup": dataRadioGroup,
    "aria-describedby": ariaDescribedBy,
    ...htmlProps
  } = props;
  const uuid = `radio-${(0, import_react3.useId)()}`;
  const formControl = (0, import_form_control.useFormControlContext)();
  const group = useRadioGroupContext();
  const isWithinRadioGroup = !!group || !!dataRadioGroup;
  const isWithinFormControl = !!formControl;
  let id = isWithinFormControl && !isWithinRadioGroup ? formControl.id : uuid;
  id = idProp != null ? idProp : id;
  const isDisabled = isDisabledProp != null ? isDisabledProp : formControl == null ? void 0 : formControl.isDisabled;
  const isReadOnly = isReadOnlyProp != null ? isReadOnlyProp : formControl == null ? void 0 : formControl.isReadOnly;
  const isRequired = isRequiredProp != null ? isRequiredProp : formControl == null ? void 0 : formControl.isRequired;
  const isInvalid = isInvalidProp != null ? isInvalidProp : formControl == null ? void 0 : formControl.isInvalid;
  const [isFocusVisible, setIsFocusVisible] = (0, import_react3.useState)(false);
  const [isFocused, setFocused] = (0, import_react3.useState)(false);
  const [isHovered, setHovering] = (0, import_react3.useState)(false);
  const [isActive, setActive] = (0, import_react3.useState)(false);
  const [isCheckedState, setChecked] = (0, import_react3.useState)(Boolean(defaultChecked));
  const isControlled = typeof isCheckedProp !== "undefined";
  const isChecked = isControlled ? isCheckedProp : isCheckedState;
  (0, import_react3.useEffect)(() => {
    return (0, import_focus_visible.trackFocusVisible)(setIsFocusVisible);
  }, []);
  const handleChange = (0, import_react3.useCallback)(
    (event) => {
      if (isReadOnly || isDisabled) {
        event.preventDefault();
        return;
      }
      if (!isControlled) {
        setChecked(event.target.checked);
      }
      onChange == null ? void 0 : onChange(event);
    },
    [isControlled, isDisabled, isReadOnly, onChange]
  );
  const onKeyDown = (0, import_react3.useCallback)(
    (event) => {
      if (event.key === " ") {
        setActive(true);
      }
    },
    [setActive]
  );
  const onKeyUp = (0, import_react3.useCallback)(
    (event) => {
      if (event.key === " ") {
        setActive(false);
      }
    },
    [setActive]
  );
  const getRadioProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      ref,
      "data-active": (0, import_shared_utils3.dataAttr)(isActive),
      "data-hover": (0, import_shared_utils3.dataAttr)(isHovered),
      "data-disabled": (0, import_shared_utils3.dataAttr)(isDisabled),
      "data-invalid": (0, import_shared_utils3.dataAttr)(isInvalid),
      "data-checked": (0, import_shared_utils3.dataAttr)(isChecked),
      "data-focus": (0, import_shared_utils3.dataAttr)(isFocused),
      "data-focus-visible": (0, import_shared_utils3.dataAttr)(isFocused && isFocusVisible),
      "data-readonly": (0, import_shared_utils3.dataAttr)(isReadOnly),
      "aria-hidden": true,
      onMouseDown: (0, import_shared_utils3.callAllHandlers)(props2.onMouseDown, () => setActive(true)),
      onMouseUp: (0, import_shared_utils3.callAllHandlers)(props2.onMouseUp, () => setActive(false)),
      onMouseEnter: (0, import_shared_utils3.callAllHandlers)(
        props2.onMouseEnter,
        () => setHovering(true)
      ),
      onMouseLeave: (0, import_shared_utils3.callAllHandlers)(
        props2.onMouseLeave,
        () => setHovering(false)
      )
    }),
    [
      isActive,
      isHovered,
      isDisabled,
      isInvalid,
      isChecked,
      isFocused,
      isReadOnly,
      isFocusVisible
    ]
  );
  const { onFocus, onBlur } = formControl != null ? formControl : {};
  const getInputProps = (0, import_react3.useCallback)(
    (props2 = {}, ref = null) => {
      const trulyDisabled = isDisabled && !isFocusable;
      return {
        ...props2,
        id,
        ref,
        type: "radio",
        name,
        value,
        onChange: (0, import_shared_utils3.callAllHandlers)(props2.onChange, handleChange),
        onBlur: (0, import_shared_utils3.callAllHandlers)(
          onBlur,
          props2.onBlur,
          () => setFocused(false)
        ),
        onFocus: (0, import_shared_utils3.callAllHandlers)(
          onFocus,
          props2.onFocus,
          () => setFocused(true)
        ),
        onKeyDown: (0, import_shared_utils3.callAllHandlers)(props2.onKeyDown, onKeyDown),
        onKeyUp: (0, import_shared_utils3.callAllHandlers)(props2.onKeyUp, onKeyUp),
        checked: isChecked,
        disabled: trulyDisabled,
        readOnly: isReadOnly,
        required: isRequired,
        "aria-invalid": (0, import_shared_utils3.ariaAttr)(isInvalid),
        "aria-disabled": (0, import_shared_utils3.ariaAttr)(trulyDisabled),
        "aria-required": (0, import_shared_utils3.ariaAttr)(isRequired),
        "data-readonly": (0, import_shared_utils3.dataAttr)(isReadOnly),
        "aria-describedby": ariaDescribedBy,
        style: visuallyHiddenStyle
      };
    },
    [
      isDisabled,
      isFocusable,
      id,
      name,
      value,
      handleChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      isChecked,
      isReadOnly,
      isRequired,
      isInvalid,
      ariaDescribedBy
    ]
  );
  const getLabelProps = (props2 = {}, ref = null) => ({
    ...props2,
    ref,
    onMouseDown: (0, import_shared_utils3.callAllHandlers)(props2.onMouseDown, stopEvent),
    "data-disabled": (0, import_shared_utils3.dataAttr)(isDisabled),
    "data-checked": (0, import_shared_utils3.dataAttr)(isChecked),
    "data-invalid": (0, import_shared_utils3.dataAttr)(isInvalid)
  });
  const getRootProps = (props2, ref = null) => ({
    ...props2,
    ref,
    "data-disabled": (0, import_shared_utils3.dataAttr)(isDisabled),
    "data-checked": (0, import_shared_utils3.dataAttr)(isChecked),
    "data-invalid": (0, import_shared_utils3.dataAttr)(isInvalid)
  });
  const state = {
    isInvalid,
    isFocused,
    isChecked,
    isActive,
    isHovered,
    isDisabled,
    isReadOnly,
    isRequired
  };
  return {
    state,
    /**
     * @deprecated - use `getRadioProps` instead
     */
    getCheckboxProps: getRadioProps,
    getRadioProps,
    getInputProps,
    getLabelProps,
    getRootProps,
    htmlProps
  };
}
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

// src/radio.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Radio = (0, import_system2.forwardRef)((props, ref) => {
  var _a;
  const group = useRadioGroupContext();
  const { onChange: onChangeProp, value: valueProp } = props;
  const styles = (0, import_system2.useMultiStyleConfig)("Radio", { ...group, ...props });
  const ownProps = (0, import_system2.omitThemingProps)(props);
  const {
    spacing = "0.5rem",
    children,
    isDisabled = group == null ? void 0 : group.isDisabled,
    isFocusable = group == null ? void 0 : group.isFocusable,
    inputProps: htmlInputProps,
    ...rest
  } = ownProps;
  let isChecked = props.isChecked;
  if ((group == null ? void 0 : group.value) != null && valueProp != null) {
    isChecked = group.value === valueProp;
  }
  let onChange = onChangeProp;
  if ((group == null ? void 0 : group.onChange) && valueProp != null) {
    onChange = (0, import_shared_utils4.callAll)(group.onChange, onChangeProp);
  }
  const name = (_a = props == null ? void 0 : props.name) != null ? _a : group == null ? void 0 : group.name;
  const {
    getInputProps,
    getCheckboxProps,
    getLabelProps,
    getRootProps,
    htmlProps
  } = useRadio({
    ...rest,
    isChecked,
    isFocusable,
    isDisabled,
    onChange,
    name
  });
  const [layoutProps, otherProps] = split(htmlProps, import_system2.layoutPropNames);
  const checkboxProps = getCheckboxProps(otherProps);
  const inputProps = getInputProps(htmlInputProps, ref);
  const labelProps = getLabelProps();
  const rootProps = Object.assign({}, layoutProps, getRootProps());
  const rootStyles = {
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "top",
    cursor: "pointer",
    position: "relative",
    ...styles.container
  };
  const checkboxStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...styles.control
  };
  const labelStyles = {
    userSelect: "none",
    marginStart: spacing,
    ...styles.label
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_system2.chakra.label, { className: "chakra-radio", ...rootProps, __css: rootStyles, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { className: "chakra-radio__input", ...inputProps }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.span,
      {
        className: "chakra-radio__control",
        ...checkboxProps,
        __css: checkboxStyles
      }
    ),
    children && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.span,
      {
        className: "chakra-radio__label",
        ...labelProps,
        __css: labelStyles,
        children
      }
    )
  ] });
});
Radio.displayName = "Radio";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Radio,
  RadioGroup,
  useRadio,
  useRadioGroup,
  useRadioGroupContext
});
//# sourceMappingURL=index.js.map