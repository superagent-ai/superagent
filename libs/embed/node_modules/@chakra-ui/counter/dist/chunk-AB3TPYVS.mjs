'use client'

// src/use-counter.ts
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
import {
  clampValue,
  countDecimalPlaces,
  toPrecision
} from "@chakra-ui/number-utils";
import { useCallback, useState } from "react";
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
  const onChangeProp = useCallbackRef(onChange);
  const [valueState, setValue] = useState(() => {
    var _a;
    if (defaultValue == null)
      return "";
    return (_a = cast(defaultValue, stepProp, precisionProp)) != null ? _a : "";
  });
  const isControlled = typeof valueProp !== "undefined";
  const value = isControlled ? valueProp : valueState;
  const decimalPlaces = getDecimalPlaces(parse(value), stepProp);
  const precision = precisionProp != null ? precisionProp : decimalPlaces;
  const update = useCallback(
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
  const clamp = useCallback(
    (value2) => {
      let nextValue = value2;
      if (keepWithinRange) {
        nextValue = clampValue(nextValue, min, max);
      }
      return toPrecision(nextValue, precision);
    },
    [precision, keepWithinRange, max, min]
  );
  const increment = useCallback(
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
  const decrement = useCallback(
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
  const reset = useCallback(() => {
    var _a;
    let next;
    if (defaultValue == null) {
      next = "";
    } else {
      next = (_a = cast(defaultValue, stepProp, precisionProp)) != null ? _a : min;
    }
    update(next);
  }, [defaultValue, precisionProp, stepProp, update, min]);
  const castValue = useCallback(
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
  return Math.max(countDecimalPlaces(step), countDecimalPlaces(value));
}
function cast(value, step, precision) {
  const parsedValue = parse(value);
  if (Number.isNaN(parsedValue))
    return void 0;
  const decimalPlaces = getDecimalPlaces(parsedValue, step);
  return toPrecision(parsedValue, precision != null ? precision : decimalPlaces);
}

export {
  useCounter
};
//# sourceMappingURL=chunk-AB3TPYVS.mjs.map