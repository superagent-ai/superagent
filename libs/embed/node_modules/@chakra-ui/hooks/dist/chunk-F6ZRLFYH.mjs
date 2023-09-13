import {
  useEventListener
} from "./chunk-34PRFZWK.mjs";

// src/use-animation-state.ts
import { getOwnerWindow } from "@chakra-ui/utils";
import { useEffect, useState } from "react";
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
    "animationend",
    () => {
      setMounted(isOpen);
    },
    () => ref.current
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
