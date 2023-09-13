import {
  useCallbackRef
} from "./chunk-TFWETJDV.mjs";

// src/use-controllable.ts
import { runIfFn } from "@chakra-ui/utils";
import { useCallback, useState } from "react";
function useControllableProp(prop, state) {
  const isControlled = prop !== void 0;
  const value = isControlled && typeof prop !== "undefined" ? prop : state;
  return [isControlled, value];
}
function useControllableState(props) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    shouldUpdate = (prev, next) => prev !== next
  } = props;
  const onChangeProp = useCallbackRef(onChange);
  const shouldUpdateProp = useCallbackRef(shouldUpdate);
  const [valueState, setValue] = useState(defaultValue);
  const isControlled = valueProp !== void 0;
  const value = isControlled ? valueProp : valueState;
  const updateValue = useCallback(
    (next) => {
      const nextValue = runIfFn(next, value);
      if (!shouldUpdateProp(value, nextValue)) {
        return;
      }
      if (!isControlled) {
        setValue(nextValue);
      }
      onChangeProp(nextValue);
    },
    [isControlled, onChangeProp, value, shouldUpdateProp]
  );
  return [value, updateValue];
}

export {
  useControllableProp,
  useControllableState
};
