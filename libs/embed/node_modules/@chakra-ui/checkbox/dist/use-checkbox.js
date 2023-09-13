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

// src/use-checkbox.ts
var use_checkbox_exports = {};
__export(use_checkbox_exports, {
  useCheckbox: () => useCheckbox
});
module.exports = __toCommonJS(use_checkbox_exports);
var import_form_control = require("@chakra-ui/form-control");
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_shared_utils = require("@chakra-ui/shared-utils");

// ../../utilities/object-utils/src/omit.ts
function omit(object, keysToOmit = []) {
  const clone = Object.assign({}, object);
  for (const key of keysToOmit) {
    if (key in clone) {
      delete clone[key];
    }
  }
  return clone;
}

// src/use-checkbox.ts
var import_visually_hidden = require("@chakra-ui/visually-hidden");
var import_focus_visible = require("@zag-js/focus-visible");
var import_react = require("react");
function useCheckbox(props = {}) {
  const formControlProps = (0, import_form_control.useFormControlProps)(props);
  const {
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    id,
    onBlur,
    onFocus,
    "aria-describedby": ariaDescribedBy
  } = formControlProps;
  const {
    defaultChecked,
    isChecked: checkedProp,
    isFocusable,
    onChange,
    isIndeterminate,
    name,
    value,
    tabIndex = void 0,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-invalid": ariaInvalid,
    ...rest
  } = props;
  const htmlProps = omit(rest, [
    "isDisabled",
    "isReadOnly",
    "isRequired",
    "isInvalid",
    "id",
    "onBlur",
    "onFocus",
    "aria-describedby"
  ]);
  const onChangeProp = (0, import_react_use_callback_ref.useCallbackRef)(onChange);
  const onBlurProp = (0, import_react_use_callback_ref.useCallbackRef)(onBlur);
  const onFocusProp = (0, import_react_use_callback_ref.useCallbackRef)(onFocus);
  const [isFocusVisible, setIsFocusVisible] = (0, import_react.useState)(false);
  const [isFocused, setFocused] = (0, import_react.useState)(false);
  const [isHovered, setHovered] = (0, import_react.useState)(false);
  const [isActive, setActive] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    return (0, import_focus_visible.trackFocusVisible)(setIsFocusVisible);
  }, []);
  const inputRef = (0, import_react.useRef)(null);
  const [rootIsLabelElement, setRootIsLabelElement] = (0, import_react.useState)(true);
  const [checkedState, setCheckedState] = (0, import_react.useState)(!!defaultChecked);
  const isControlled = checkedProp !== void 0;
  const isChecked = isControlled ? checkedProp : checkedState;
  const handleChange = (0, import_react.useCallback)(
    (event) => {
      if (isReadOnly || isDisabled) {
        event.preventDefault();
        return;
      }
      if (!isControlled) {
        if (isChecked) {
          setCheckedState(event.target.checked);
        } else {
          setCheckedState(isIndeterminate ? true : event.target.checked);
        }
      }
      onChangeProp == null ? void 0 : onChangeProp(event);
    },
    [
      isReadOnly,
      isDisabled,
      isChecked,
      isControlled,
      isIndeterminate,
      onChangeProp
    ]
  );
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate]);
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    if (isDisabled) {
      setFocused(false);
    }
  }, [isDisabled, setFocused]);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    const el = inputRef.current;
    if (!(el == null ? void 0 : el.form))
      return;
    const formResetListener = () => {
      setCheckedState(!!defaultChecked);
    };
    el.form.addEventListener("reset", formResetListener);
    return () => {
      var _a;
      return (_a = el.form) == null ? void 0 : _a.removeEventListener("reset", formResetListener);
    };
  }, []);
  const trulyDisabled = isDisabled && !isFocusable;
  const onKeyDown = (0, import_react.useCallback)(
    (event) => {
      if (event.key === " ") {
        setActive(true);
      }
    },
    [setActive]
  );
  const onKeyUp = (0, import_react.useCallback)(
    (event) => {
      if (event.key === " ") {
        setActive(false);
      }
    },
    [setActive]
  );
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!inputRef.current)
      return;
    const notInSync = inputRef.current.checked !== isChecked;
    if (notInSync) {
      setCheckedState(inputRef.current.checked);
    }
  }, [inputRef.current]);
  const getCheckboxProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => {
      const onPressDown = (event) => {
        if (isFocused) {
          event.preventDefault();
        }
        setActive(true);
      };
      return {
        ...props2,
        ref: forwardedRef,
        "data-active": (0, import_shared_utils.dataAttr)(isActive),
        "data-hover": (0, import_shared_utils.dataAttr)(isHovered),
        "data-checked": (0, import_shared_utils.dataAttr)(isChecked),
        "data-focus": (0, import_shared_utils.dataAttr)(isFocused),
        "data-focus-visible": (0, import_shared_utils.dataAttr)(isFocused && isFocusVisible),
        "data-indeterminate": (0, import_shared_utils.dataAttr)(isIndeterminate),
        "data-disabled": (0, import_shared_utils.dataAttr)(isDisabled),
        "data-invalid": (0, import_shared_utils.dataAttr)(isInvalid),
        "data-readonly": (0, import_shared_utils.dataAttr)(isReadOnly),
        "aria-hidden": true,
        onMouseDown: (0, import_shared_utils.callAllHandlers)(props2.onMouseDown, onPressDown),
        onMouseUp: (0, import_shared_utils.callAllHandlers)(props2.onMouseUp, () => setActive(false)),
        onMouseEnter: (0, import_shared_utils.callAllHandlers)(
          props2.onMouseEnter,
          () => setHovered(true)
        ),
        onMouseLeave: (0, import_shared_utils.callAllHandlers)(
          props2.onMouseLeave,
          () => setHovered(false)
        )
      };
    },
    [
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isFocusVisible,
      isHovered,
      isIndeterminate,
      isInvalid,
      isReadOnly
    ]
  );
  const getIndicatorProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => ({
      ...props2,
      ref: forwardedRef,
      "data-active": (0, import_shared_utils.dataAttr)(isActive),
      "data-hover": (0, import_shared_utils.dataAttr)(isHovered),
      "data-checked": (0, import_shared_utils.dataAttr)(isChecked),
      "data-focus": (0, import_shared_utils.dataAttr)(isFocused),
      "data-focus-visible": (0, import_shared_utils.dataAttr)(isFocused && isFocusVisible),
      "data-indeterminate": (0, import_shared_utils.dataAttr)(isIndeterminate),
      "data-disabled": (0, import_shared_utils.dataAttr)(isDisabled),
      "data-invalid": (0, import_shared_utils.dataAttr)(isInvalid),
      "data-readonly": (0, import_shared_utils.dataAttr)(isReadOnly)
    }),
    [
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isFocusVisible,
      isHovered,
      isIndeterminate,
      isInvalid,
      isReadOnly
    ]
  );
  const getRootProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => ({
      ...htmlProps,
      ...props2,
      ref: (0, import_react_use_merge_refs.mergeRefs)(forwardedRef, (node) => {
        if (!node)
          return;
        setRootIsLabelElement(node.tagName === "LABEL");
      }),
      onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, () => {
        var _a;
        if (!rootIsLabelElement) {
          (_a = inputRef.current) == null ? void 0 : _a.click();
          requestAnimationFrame(() => {
            var _a2;
            (_a2 = inputRef.current) == null ? void 0 : _a2.focus({ preventScroll: true });
          });
        }
      }),
      "data-disabled": (0, import_shared_utils.dataAttr)(isDisabled),
      "data-checked": (0, import_shared_utils.dataAttr)(isChecked),
      "data-invalid": (0, import_shared_utils.dataAttr)(isInvalid)
    }),
    [htmlProps, isDisabled, isChecked, isInvalid, rootIsLabelElement]
  );
  const getInputProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => {
      return {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(inputRef, forwardedRef),
        type: "checkbox",
        name,
        value,
        id,
        tabIndex,
        onChange: (0, import_shared_utils.callAllHandlers)(props2.onChange, handleChange),
        onBlur: (0, import_shared_utils.callAllHandlers)(
          props2.onBlur,
          onBlurProp,
          () => setFocused(false)
        ),
        onFocus: (0, import_shared_utils.callAllHandlers)(
          props2.onFocus,
          onFocusProp,
          () => setFocused(true)
        ),
        onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDown),
        onKeyUp: (0, import_shared_utils.callAllHandlers)(props2.onKeyUp, onKeyUp),
        required: isRequired,
        checked: isChecked,
        disabled: trulyDisabled,
        readOnly: isReadOnly,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": isDisabled,
        style: import_visually_hidden.visuallyHiddenStyle
      };
    },
    [
      name,
      value,
      id,
      handleChange,
      onBlurProp,
      onFocusProp,
      onKeyDown,
      onKeyUp,
      isRequired,
      isChecked,
      trulyDisabled,
      isReadOnly,
      ariaLabel,
      ariaLabelledBy,
      ariaInvalid,
      isInvalid,
      ariaDescribedBy,
      isDisabled,
      tabIndex
    ]
  );
  const getLabelProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => ({
      ...props2,
      ref: forwardedRef,
      onMouseDown: (0, import_shared_utils.callAllHandlers)(props2.onMouseDown, stopEvent),
      "data-disabled": (0, import_shared_utils.dataAttr)(isDisabled),
      "data-checked": (0, import_shared_utils.dataAttr)(isChecked),
      "data-invalid": (0, import_shared_utils.dataAttr)(isInvalid)
    }),
    [isChecked, isDisabled, isInvalid]
  );
  const state = {
    isInvalid,
    isFocused,
    isChecked,
    isActive,
    isHovered,
    isIndeterminate,
    isDisabled,
    isReadOnly,
    isRequired
  };
  return {
    state,
    getRootProps,
    getCheckboxProps,
    getIndicatorProps,
    getInputProps,
    getLabelProps,
    htmlProps
  };
}
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCheckbox
});
//# sourceMappingURL=use-checkbox.js.map