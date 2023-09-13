'use client'

// src/index.ts
import { useEffect, useState } from "react";
import { useEventListener } from "@chakra-ui/react-use-event-listener";
import { getOwnerWindow } from "@chakra-ui/dom-utils";
function useAnimationState(props) {
  const { isOpen, ref } = props;
  const [mounted, setMounted] = useState(isOpen);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (!once) {
      setMounted(isOpen);
      setOnce(true);
    }
  }, [isOpen, once, mounted]);
  useEventListener(
    () => ref.current,
    "animationend",
    () => {
      setMounted(isOpen);
    }
  );
  const hidden = isOpen ? false : !mounted;
  return {
    present: !hidden,
    onComplete() {
      var _a;
      const win = getOwnerWindow(ref.current);
      const evt = new win.CustomEvent("animationend", { bubbles: true });
      (_a = ref.current) == null ? void 0 : _a.dispatchEvent(evt);
    }
  };
}
export {
  useAnimationState
};
//# sourceMappingURL=index.mjs.map