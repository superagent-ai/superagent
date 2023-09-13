'use client'
import {
  usePopoverContext
} from "./chunk-Z3POGKNI.mjs";

// src/popover-transition.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { motion } from "framer-motion";
import { jsx } from "react/jsx-runtime";
function mergeVariants(variants) {
  if (!variants)
    return;
  return {
    enter: {
      ...variants.enter,
      visibility: "visible"
    },
    exit: {
      ...variants.exit,
      transitionEnd: {
        visibility: "hidden"
      }
    }
  };
}
var scaleFade = {
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1]
    }
  },
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: [0, 0, 0.2, 1]
    }
  }
};
var MotionSection = chakra(motion.section);
var PopoverTransition = forwardRef(function PopoverTransition2(props, ref) {
  const { variants = scaleFade, ...rest } = props;
  const { isOpen } = usePopoverContext();
  return /* @__PURE__ */ jsx(
    MotionSection,
    {
      ref,
      variants: mergeVariants(variants),
      initial: false,
      animate: isOpen ? "enter" : "exit",
      ...rest
    }
  );
});
PopoverTransition.displayName = "PopoverTransition";

export {
  PopoverTransition
};
//# sourceMappingURL=chunk-F4GPNG57.mjs.map