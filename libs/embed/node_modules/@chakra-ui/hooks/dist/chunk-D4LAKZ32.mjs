import {
  useSafeLayoutEffect
} from "./chunk-IYF65QR3.mjs";

// src/use-dimensions.ts
import { getBox } from "@chakra-ui/utils";
import { useRef, useState } from "react";
function useDimensions(ref, observe) {
  const [dimensions, setDimensions] = useState(null);
  const rafId = useRef();
  useSafeLayoutEffect(() => {
    function measure() {
      const node = ref.current;
      if (!node)
        return;
      rafId.current = requestAnimationFrame(() => {
        const boxModel = getBox(node);
        setDimensions(boxModel);
      });
    }
    measure();
    if (observe) {
      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure);
    }
    return () => {
      if (observe) {
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [observe]);
  return dimensions;
}

export {
  useDimensions
};
