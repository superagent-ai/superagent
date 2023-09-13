import {
  useUpdateEffect
} from "./chunk-5AOLTBA4.mjs";

// src/use-focus-effect.ts
import { hasFocusWithin, focus } from "@chakra-ui/utils";
function useFocusEffect(ref, options) {
  const { shouldFocus, preventScroll } = options;
  useUpdateEffect(() => {
    const node = ref.current;
    if (!node || !shouldFocus)
      return;
    if (!hasFocusWithin(node)) {
      focus(node, { preventScroll, nextTick: true });
    }
  }, [shouldFocus, ref, preventScroll]);
}

export {
  useFocusEffect
};
