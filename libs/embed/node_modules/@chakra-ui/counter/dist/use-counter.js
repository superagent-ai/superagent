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

// src/use-counter.ts
var use_counter_exports = {};
__export(use_counter_exports, {
  useCounter: () => useCounter
});
module.exports = __toCommonJS(use_counter_exports);
var import_react_use_callback_ref = require("@chakra-ui/react-use-callback-ref");
var import_number_utils = require("@chakra-ui/number-utils");
var import_react = require("react");
function useCounter(props = {}) {
  const {
    onChange,
    precision: precisionProp,
    defaultValue,
    value: valueProp,
    step: stepProp = 1,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    keepWithinRange = true
  } = props;
  const onChangeProp = (0, import_react_use_callback_ref.useCallbackRef)(onChange);
  const [valueState, setValue] = (0, import_react.useState)(() => {
    var _a;
    if (defaultValue == null)
      return "";
    return (_a = cast(defaultValue, stepProp, precisionProp)) != null ? _a : "";
  });
  const isControlled = typeof valueProp !== "undefined";
  const value = isControlled ? valueProp : valueState;
  const decimalPlaces = getDecimalPlaces(parse(value), stepProp);
  const precision = precisionProp != null ? precisionProp : decimalPlaces;
  const update = (0, import_react.useCallback)(
    (next) => {
      if (next === value)
        return;
      if (!isControlled) {
        setValue(next.toString());
      }
      onChangeProp == null ? void 0 : onChangeProp(next.toString(), parse(next));
    },
    [onChangeProp, isControlled, value]
  );
  const clamp = (0, import_react.useCallback)(
    (value2) => {
      let nextValue = value2;
      if (keepWithinRange) {
        nextValue = (0, import_number_utils.clampValue)(nextValue, min, max);
      }
      return (0, import_number_utils.toPrecision)(nextValue, precision);
    },
    [precision, keepWithinRange, max, min]
  );
  const increment = (0, import_react.useCallback)(
    (step = stepProp) => {
      let next;
      if (value === "") {
        next = parse(step);
      } else {
        next = parse(value) + step;
      }
      next = clamp(next);
      update(next);
    },
    [clamp, stepProp, update, value]
  );
  const decrement = (0, import_react.useCallback)(
    (step = stepProp) => {
      let next;
      if (value === "") {
        next = parse(-step);
      } else {
        next = parse(value) - step;
      }
      next = clamp(next);
      update(next);
    },
    [clamp, stepProp, update, value]
  );
  const reset = (0, import_react.useCallback)(() => {
    var _a;
    let next;
    if (defaultValue == null) {
      next = "";
    } else {
      next = (_a = cast(defaultValue, stepProp, precisionProp)) != null ? _a : min;
    }
    update(next);
  }, [defaultValue, precisionProp, stepProp, update, min]);
  const castValue = (0, import_react.useCallback)(
    (value2) => {
      var _a;
      const nextValue = (_a = cast(value2, stepProp, precision)) != null ? _a : min;
      update(nextValue);
    },
    [precision, stepProp, update, min]
  );
  const valueAsNumber = parse(value);
  const isOutOfRange = valueAsNumber > max || valueAsNumber < min;
  const isAtMax = valueAsNumber === max;
  const isAtMin = valueAsNumber === min;
  return {
    isOutOfRange,
    isAtMax,
    isAtMin,
    precision,
    value,
    valueAsNumber,
    update,
    reset,
    increment,
    decrement,
    clamp,
    cast: castValue,
    setValue
  };
}
function parse(value) {
  return parseFloat(value.toString().replace(/[^\w.-]+/g, ""));
}
function getDecimalPlaces(value, step) {
  return Math.max((0, import_number_utils.countDecimalPlaces)(step), (0, import_number_utils.countDecimalPlaces)(value));
}
function cast(value, step, precision) {
  const parsedValue = parse(value);
  if (Number.isNaN(parsedValue))
    return void 0;
  const decimalPlaces = getDecimalPlaces(parsedValue, step);
  return (0, import_number_utils.toPrecision)(parsedValue, precision != null ? precision : decimalPlaces);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCounter
});
//# sourceMappingURL=use-counter.js.map