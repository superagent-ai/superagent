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
  PinInput: () => PinInput,
  PinInputDescendantsProvider: () => PinInputDescendantsProvider,
  PinInputField: () => PinInputField,
  PinInputProvider: () => PinInputProvider,
  usePinInput: () => usePinInput,
  usePinInputContext: () => usePinInputContext,
  usePinInputField: () => usePinInputField
});
module.exports = __toCommonJS(src_exports);

// src/pin-input.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react_children_utils = require("@chakra-ui/react-children-utils");

// src/use-pin-input.ts
var import_descendant = require("@chakra-ui/descendant");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_context = require("@chakra-ui/react-context");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_react = require("react");
var [
  PinInputDescendantsProvider,
  usePinInputDescendantsContext,
  usePinInputDescendants,
  usePinInputDescendant
] = (0, import_descendant.createDescendantContext)();
var [PinInputProvider, usePinInputContext] = (0, import_react_context.createContext)({
  name: "PinInputContext",
  errorMessage: "usePinInputContext: `context` is undefined. Seems you forgot to all pin input fields within `<PinInput />`"
});
var toArray = (value) => value == null ? void 0 : value.split("");
function validate(value, type) {
  const NUMERIC_REGEX = /^[0-9]+$/;
  const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i;
  const regex = type === "alphanumeric" ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX;
  return regex.test(value);
}
function usePinInput(props = {}) {
  const {
    autoFocus,
    value,
    defaultValue,
    onChange,
    onComplete,
    placeholder = "\u25CB",
    manageFocus = true,
    otp = false,
    id: idProp,
    isDisabled,
    isInvalid,
    type = "number",
    mask
  } = props;
  const uuid = (0, import_react.useId)();
  const id = idProp != null ? idProp : `pin-input-${uuid}`;
  const descendants = usePinInputDescendants();
  const [moveFocus, setMoveFocus] = (0, import_react.useState)(true);
  const [focusedIndex, setFocusedIndex] = (0, import_react.useState)(-1);
  const [values, setValues] = (0, import_react_use_controllable_state.useControllableState)({
    defaultValue: toArray(defaultValue) || [],
    value: toArray(value),
    onChange: (values2) => onChange == null ? void 0 : onChange(values2.join(""))
  });
  (0, import_react.useEffect)(() => {
    if (autoFocus) {
      const first = descendants.first();
      if (first) {
        requestAnimationFrame(() => {
          first.node.focus();
        });
      }
    }
  }, [descendants]);
  const focusNext = (0, import_react.useCallback)(
    (index) => {
      if (!moveFocus || !manageFocus)
        return;
      const next = descendants.next(index, false);
      if (next) {
        requestAnimationFrame(() => {
          next.node.focus();
        });
      }
    },
    [descendants, moveFocus, manageFocus]
  );
  const setValue = (0, import_react.useCallback)(
    (value2, index, handleFocus = true) => {
      const nextValues = [...values];
      nextValues[index] = value2;
      setValues(nextValues);
      const isComplete = value2 !== "" && nextValues.length === descendants.count() && nextValues.every(
        (inputValue) => inputValue != null && inputValue !== ""
      );
      if (isComplete) {
        onComplete == null ? void 0 : onComplete(nextValues.join(""));
      } else {
        if (handleFocus)
          focusNext(index);
      }
    },
    [values, setValues, focusNext, onComplete, descendants]
  );
  const clear = (0, import_react.useCallback)(() => {
    var _a;
    const values2 = Array(descendants.count()).fill("");
    setValues(values2);
    const first = descendants.first();
    (_a = first == null ? void 0 : first.node) == null ? void 0 : _a.focus();
  }, [descendants, setValues]);
  const getNextValue = (0, import_react.useCallback)((value2, eventValue) => {
    let nextValue = eventValue;
    if ((value2 == null ? void 0 : value2.length) > 0) {
      if (value2[0] === eventValue.charAt(0)) {
        nextValue = eventValue.charAt(1);
      } else if (value2[0] === eventValue.charAt(1)) {
        nextValue = eventValue.charAt(0);
      }
    }
    return nextValue;
  }, []);
  const getInputProps = (0, import_react.useCallback)(
    (props2) => {
      const { index, ...rest } = props2;
      const onChange2 = (event) => {
        const eventValue = event.target.value;
        const currentValue = values[index];
        const nextValue = getNextValue(currentValue, eventValue);
        if (nextValue === "") {
          setValue("", index);
          return;
        }
        if (eventValue.length > 2) {
          if (validate(eventValue, type)) {
            const nextValue2 = eventValue.split("").filter((_, index2) => index2 < descendants.count());
            setValues(nextValue2);
            if (nextValue2.length === descendants.count()) {
              onComplete == null ? void 0 : onComplete(nextValue2.join(""));
            }
          }
        } else {
          if (validate(nextValue, type)) {
            setValue(nextValue, index);
          }
          setMoveFocus(true);
        }
      };
      const onKeyDown = (event) => {
        var _a;
        if (event.key === "Backspace" && manageFocus) {
          if (event.target.value === "") {
            const prevInput = descendants.prev(index, false);
            if (prevInput) {
              setValue("", index - 1, false);
              (_a = prevInput.node) == null ? void 0 : _a.focus();
              setMoveFocus(true);
            }
          } else {
            setMoveFocus(false);
          }
        }
      };
      const onFocus = () => {
        setFocusedIndex(index);
      };
      const onBlur = () => {
        setFocusedIndex(-1);
      };
      const hasFocus = focusedIndex === index;
      const inputType = type === "number" ? "tel" : "text";
      return {
        "aria-label": "Please enter your pin code",
        inputMode: type === "number" ? "numeric" : "text",
        type: mask ? "password" : inputType,
        ...rest,
        id: `${id}-${index}`,
        disabled: isDisabled,
        "aria-invalid": (0, import_shared_utils.ariaAttr)(isInvalid),
        onChange: (0, import_shared_utils.callAllHandlers)(rest.onChange, onChange2),
        onKeyDown: (0, import_shared_utils.callAllHandlers)(rest.onKeyDown, onKeyDown),
        onFocus: (0, import_shared_utils.callAllHandlers)(rest.onFocus, onFocus),
        onBlur: (0, import_shared_utils.callAllHandlers)(rest.onBlur, onBlur),
        value: values[index] || "",
        autoComplete: otp ? "one-time-code" : "off",
        placeholder: hasFocus ? "" : placeholder
      };
    },
    [
      descendants,
      focusedIndex,
      getNextValue,
      id,
      isDisabled,
      mask,
      isInvalid,
      manageFocus,
      onComplete,
      otp,
      placeholder,
      setValue,
      setValues,
      type,
      values
    ]
  );
  return {
    // prop getter
    getInputProps,
    // state
    id,
    descendants,
    values,
    // actions
    setValue,
    setValues,
    clear
  };
}
function usePinInputField(props = {}, ref = null) {
  const { getInputProps } = usePinInputContext();
  const { index, register } = usePinInputDescendant();
  return getInputProps({
    ...props,
    ref: (0, import_react_use_merge_refs.mergeRefs)(register, ref),
    index
  });
}

// src/pin-input.tsx
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function PinInput(props) {
  const styles = (0, import_system.useStyleConfig)("PinInput", props);
  const { children, ...rest } = (0, import_system.omitThemingProps)(props);
  const { descendants, ...context } = usePinInput(rest);
  const clones = (0, import_react_children_utils.getValidChildren)(children).map(
    (child) => (0, import_react2.cloneElement)(child, { __css: styles })
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInputDescendantsProvider, { value: descendants, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInputProvider, { value: context, children: clones }) });
}
PinInput.displayName = "PinInput";
var PinInputField = (0, import_system.forwardRef)(
  function PinInputField2(props, ref) {
    const inputProps = usePinInputField(props, ref);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.input,
      {
        ...inputProps,
        className: (0, import_shared_utils2.cx)("chakra-pin-input", props.className)
      }
    );
  }
);
PinInputField.displayName = "PinInputField";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PinInput,
  PinInputDescendantsProvider,
  PinInputField,
  PinInputProvider,
  usePinInput,
  usePinInputContext,
  usePinInputField
});
//# sourceMappingURL=index.js.map