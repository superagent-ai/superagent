'use client'

// src/use-button-type.tsx
import { useCallback, useState } from "react";
function useButtonType(value) {
  const [isButton, setIsButton] = useState(!value);
  const refCallback = useCallback((node) => {
    if (!node)
      return;
    setIsButton(node.tagName === "BUTTON");
  }, []);
  const type = isButton ? "button" : void 0;
  return { ref: refCallback, type };
}

export {
  useButtonType
};
//# sourceMappingURL=chunk-J37R6SZE.mjs.map