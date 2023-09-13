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

// src/radio-group.tsx
var radio_group_exports = {};
__export(radio_group_exports, {
  RadioGroup: () => RadioGroup,
  useRadioGroupContext: () => useRadioGroupContext
});
module.exports = __toCommonJS(radio_group_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RadioGroup,
  useRadioGroupContext
});
//# sourceMappingURL=radio-group.js.map