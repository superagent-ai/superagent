'use client'
import {
  TRANSITION_EASINGS,
  getSlideTransition,
  withDelay
} from "./chunk-6NHXDBFO.mjs";

// src/slide.tsx
import { cx } from "@chakra-ui/shared-utils";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var defaultTransition = {
  exit: {
    duration: 0.15,
    ease: TRANSITION_EASINGS.easeInOut
  },
  enter: {
    type: "spring",
    damping: 25,
    stiffness: 180
  }
};
var variants = {
  exit: ({ direction, transition, transitionEnd, delay }) => {
    var _a;
    const { exit: exitStyles } = getSlideTransition({ direction });
    return {
      ...exitStyles,
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(defaultTransition.exit, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit
    };
  },
  enter: ({ direction, transitionEnd, transition, delay }) => {
    var _a;
    const { enter: enterStyles } = getSlideTransition({ direction });
    return {
      ...enterStyles,
      transition: (_a = transition == null ? void 0 : transition.enter) != null ? _a : withDelay.enter(defaultTransition.enter, delay),
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter
    };
  }
};
var Slide = forwardRef(function Slide2(props, ref) {
  const {
    direction = "right",
    style,
    unmountOnExit,
    in: isOpen,
    className,
    transition,
    transitionEnd,
    delay,
    motionProps,
    ...rest
  } = props;
  const transitionStyles = getSlideTransition({ direction });
  const computedStyle = Object.assign(
    { position: "fixed" },
    transitionStyles.position,
    style
  );
  const show = unmountOnExit ? isOpen && unmountOnExit : true;
  const animate = isOpen || unmountOnExit ? "enter" : "exit";
  const custom = { transitionEnd, transition, direction, delay };
  return /* @__PURE__ */ jsx(AnimatePresence, { custom, children: show && /* @__PURE__ */ jsx(
    motion.div,
    {
      ...rest,
      ref,
      initial: "exit",
      className: cx("chakra-slide", className),
      animate,
      exit: "exit",
      custom,
      variants,
      style: computedStyle,
      ...motionProps
    }
  ) });
});
Slide.displayName = "Slide";

export {
  Slide
};
//# sourceMappingURL=chunk-CYUETFQE.mjs.map