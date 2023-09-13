'use client'
import {
  TRANSITION_DEFAULTS,
  withDelay
} from "./chunk-6NHXDBFO.mjs";

// src/scale-fade.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var variants = {
  exit: ({ reverse, initialScale, transition, transitionEnd, delay }) => {
    var _a;
    return {
      opacity: 0,
      ...reverse ? { scale: initialScale, transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit } : { transitionEnd: { scale: initialScale, ...transitionEnd == null ? void 0 : transitionEnd.exit } },
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(TRANSITION_DEFAULTS.exit, delay)
    };
  },
  enter: ({ transitionEnd, transition, delay }) => {
    var _a;
    return {
      opacity: 1,
      scale: 1,
      transition: (_a = transition == null ? void 0 : transition.enter) != null ? _a : withDelay.enter(TRANSITION_DEFAULTS.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  }
};
var scaleFadeConfig = {
  initial: "exit",
  animate: "enter",
  exit: "exit",
  variants
};
var ScaleFade = forwardRef(
  function ScaleFade2(props, ref) {
    const {
      unmountOnExit,
      in: isOpen,
      reverse = true,
      initialScale = 0.95,
      className,
      transition,
      transitionEnd,
      delay,
      ...rest
    } = props;
    const show = unmountOnExit ? isOpen && unmountOnExit : true;
    const animate = isOpen || unmountOnExit ? "enter" : "exit";
    const custom = { initialScale, reverse, transition, transitionEnd, delay };
    return /* @__PURE__ */ jsx(AnimatePresence, { custom, children: show && /* @__PURE__ */ jsx(
      motion.div,
      {
        ref,
        className: cx("chakra-offset-slide", className),
        ...scaleFadeConfig,
        animate,
        custom,
        ...rest
      }
    ) });
  }
);
ScaleFade.displayName = "ScaleFade";

export {
  scaleFadeConfig,
  ScaleFade
};
//# sourceMappingURL=chunk-SR4VX3RF.mjs.map