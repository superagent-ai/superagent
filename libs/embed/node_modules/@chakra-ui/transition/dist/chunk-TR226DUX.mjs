'use client'
import {
  TRANSITION_DEFAULTS,
  withDelay
} from "./chunk-6NHXDBFO.mjs";

// src/fade.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var variants = {
  enter: ({ transition, transitionEnd, delay } = {}) => {
    var _a;
    return {
      opacity: 1,
      transition: (_a = transition == null ? void 0 : transition.enter) != null ? _a : withDelay.enter(TRANSITION_DEFAULTS.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  },
  exit: ({ transition, transitionEnd, delay } = {}) => {
    var _a;
    return {
      opacity: 0,
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(TRANSITION_DEFAULTS.exit, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    };
  }
};
var fadeConfig = {
  initial: "exit",
  animate: "enter",
  exit: "exit",
  variants
};
var Fade = forwardRef(function Fade2(props, ref) {
  const {
    unmountOnExit,
    in: isOpen,
    className,
    transition,
    transitionEnd,
    delay,
    ...rest
  } = props;
  const animate = isOpen || unmountOnExit ? "enter" : "exit";
  const show = unmountOnExit ? isOpen && unmountOnExit : true;
  const custom = { transition, transitionEnd, delay };
  return /* @__PURE__ */ jsx(AnimatePresence, { custom, children: show && /* @__PURE__ */ jsx(
    motion.div,
    {
      ref,
      className: cx("chakra-fade", className),
      custom,
      ...fadeConfig,
      animate,
      ...rest
    }
  ) });
});
Fade.displayName = "Fade";

export {
  fadeConfig,
  Fade
};
//# sourceMappingURL=chunk-TR226DUX.mjs.map