'use client'

// src/use-initial-animation-state.tsx
import { useState } from "react";
function useInitialAnimationState(isChecked) {
  const [previousIsChecked, setPreviousIsChecked] = useState(isChecked);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  if (isChecked !== previousIsChecked) {
    setShouldAnimate(true);
    setPreviousIsChecked(isChecked);
  }
  return shouldAnimate;
}

export {
  useInitialAnimationState
};
//# sourceMappingURL=chunk-2TOCDA5N.mjs.map