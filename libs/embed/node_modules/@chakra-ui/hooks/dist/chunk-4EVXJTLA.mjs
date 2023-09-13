// src/use-boolean.ts
import { useMemo, useState } from "react";
function useBoolean(initialState = false) {
  const [value, setValue] = useState(initialState);
  const callbacks = useMemo(
    () => ({
      on: () => setValue(true),
      off: () => setValue(false),
      toggle: () => setValue((prev) => !prev)
    }),
    []
  );
  return [value, callbacks];
}

export {
  useBoolean
};
