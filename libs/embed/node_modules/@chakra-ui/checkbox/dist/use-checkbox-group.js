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

// src/use-checkbox-group.ts
var use_checkbox_group_exports = {};
__export(use_checkbox_group_exports, {
  useCheckboxGroup: () => useCheckboxGroup
});
module.exports = __toCommonJS(use_checkbox_group_exports);
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
function isInputEvent(value) {
  return value && (0, import_shared_utils.isObject)(value) && (0, import_shared_utils.isObject)(value.target);
}
function useCheckboxGroup(props = {}) {
  const {
    defaultValue,
    value: valueProp,
    onChange,
    isDisabled,
    isNative
  } = props;
  const onChangeProp = (0, import_react_use_callback_ref.useCallbackRef)(onChange);
  const [value, setValue] = (0, import_react_use_controllable_state.useControllableState)({
    value: valueProp,
    defaultValue: defaultValue || [],
    onChange: onChangeProp
  });
  const handleChange = (0, import_react.useCallback)(
    (eventOrValue) => {
      if (!value)
        return;
      const isChecked = isInputEvent(eventOrValue) ? eventOrValue.target.checked : !value.includes(eventOrValue);
      const selectedValue = isInputEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;
      const nextValue = isChecked ? [...value, selectedValue] : value.filter((v) => String(v) !== String(selectedValue));
      setValue(nextValue);
    },
    [setValue, value]
  );
  const getCheckboxProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      const checkedKey = isNative ? "checked" : "isChecked";
      return {
        ...props2,
        [checkedKey]: value.some((val) => String(props2.value) === String(val)),
        onChange: handleChange
      };
    },
    [handleChange, isNative, value]
  );
  return {
    value,
    isDisabled,
    onChange: handleChange,
    setValue,
    getCheckboxProps
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCheckboxGroup
});
//# sourceMappingURL=use-checkbox-group.js.map