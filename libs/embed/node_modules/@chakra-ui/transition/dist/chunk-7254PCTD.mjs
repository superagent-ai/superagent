'use client'
import {
  TRANSITION_DEFAULTS,
  withDelay
} from "./chunk-6NHXDBFO.mjs";

// src/slide-fade.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var variants = {
  initial: ({ offsetX, offsetY, transition, transitionEnd, delay }) => {
    var _a;
    return {
      opacity: 0,
      x: offsetX,
      y: offsetY,
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(TRANSITION_DEFAULTS.exit, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    };
  },
  enter: ({ transition, transitionEnd, delay }) => {
    var _a;
    return {
      opacity: 1,
      x: 0,
      y: 0,
      transition: (_a = transition == null ? void 0 : transition.enter) != null ? _a : withDelay.enter(TRANSITION_DEFAULTS.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  },
  exit: ({ offsetY, offsetX, transition, transitionEnd, reverse, delay }) => {
    var _a;
    const offset = { x: offsetX, y: offsetY };
    return {
      opacity: 0,
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(TRANSITION_DEFAULTS.exit, delay),
      ...reverse ? { ...offset, transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit } : { transitionEnd: { ...offset, ...transitionEnd == null ? void 0 : transitionEnd.exit } }
    };
  }
};
var slideFadeConfig = {
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants
};
var SlideFade = forwardRef(
  function SlideFade2(props, ref) {
    const {
      unmountOnExit,
      in: isOpen,
      reverse = true,
      className,
      offsetX = 0,
      offsetY = 8,
      transition,
      transitionEnd,
      delay,
      ...rest
    } = props;
    const show = unmountOnExit ? isOpen && unmountOnExit : true;
    const animate = isOpen || unmountOnExit ? "enter" : "exit";
    const custom = {
      offsetX,
      offsetY,
      reverse,
      transition,
      transitionEnd,
      delay
    };
    return /* @__PURE__ */ jsx(AnimatePresence, { custom, children: show && /* @__PURE__ */ jsx(
      motion.div,
      {
        ref,
        className: cx("chakra-offset-slide", className),
        custom,
        ...slideFadeConfig,
        animate,
        ...rest
      }
    ) });
  }
);
SlideFade.displayName = "SlideFade";

export {
  slideFadeConfig,
  SlideFade
};
//# sourceMappingURL=chunk-7254PCTD.mjs.map