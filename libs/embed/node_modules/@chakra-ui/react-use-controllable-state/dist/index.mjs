'use client'

// src/index.ts
import { useMemo, useState } from "react";
import { useCallbackRef } from "@chakra-ui/react-use-callback-ref";
function useControllableProp(prop, state) {
  const controlled = typeof prop !== "undefined";
  const value = controlled ? prop : state;
  return useMemo(() => [controlled, value], [controlled, value]);
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
  const [uncontrolledState, setUncontrolledState] = useState(defaultValue);
  const controlled = valueProp !== void 0;
  const value = controlled ? valueProp : uncontrolledState;
  const setValue = useCallbackRef(
    (next) => {
      const setter = next;
      const nextValue = typeof next === "function" ? setter(value) : next;
      if (!shouldUpdateProp(value, nextValue)) {
        return;
      }
      if (!controlled) {
        setUncontrolledState(nextValue);
      }
      onChangeProp(nextValue);
    },
    [controlled, onChangeProp, value, shouldUpdateProp]
  );
  return [value, setValue];
}
export {
  useControllableProp,
  useControllableState
};
//# sourceMappingURL=index.mjs.map