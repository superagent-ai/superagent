'use client'
import {
  TRANSITION_EASINGS,
  withDelay
} from "./chunk-6NHXDBFO.mjs";

// src/collapse.tsx
import { cx, warn } from "@chakra-ui/shared-utils";
import {
  AnimatePresence,
  motion
} from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var isNumeric = (value) => value != null && parseInt(value.toString(), 10) > 0;
var defaultTransitions = {
  exit: {
    height: { duration: 0.2, ease: TRANSITION_EASINGS.ease },
    opacity: { duration: 0.3, ease: TRANSITION_EASINGS.ease }
  },
  enter: {
    height: { duration: 0.3, ease: TRANSITION_EASINGS.ease },
    opacity: { duration: 0.4, ease: TRANSITION_EASINGS.ease }
  }
};
var variants = {
  exit: ({
    animateOpacity,
    startingHeight,
    transition,
    transitionEnd,
    delay
  }) => {
    var _a;
    return {
      ...animateOpacity && { opacity: isNumeric(startingHeight) ? 1 : 0 },
      height: startingHeight,
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.exit,
      transition: (_a = transition == null ? void 0 : transition.exit) != null ? _a : withDelay.exit(defaultTransitions.exit, delay)
    };
  },
  enter: ({
    animateOpacity,
    endingHeight,
    transition,
    transitionEnd,
    delay
  }) => {
    var _a;
    return {
      ...animateOpacity && { opacity: 1 },
      height: endingHeight,
      transitionEnd: transitionEnd == null ? void 0 : transitionEnd.enter,
      transition: (_a = transition == null ? void 0 : transition.enter) != null ? _a : withDelay.enter(defaultTransitions.enter, delay)
    };
  }
};
var Collapse = forwardRef(
  (props, ref) => {
    const {
      in: isOpen,
      unmountOnExit,
      animateOpacity = true,
      startingHeight = 0,
      endingHeight = "auto",
      style,
      className,
      transition,
      transitionEnd,
      ...rest
    } = props;
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      const timeout = setTimeout(() => {
        setMounted(true);
      });
      return () => clearTimeout(timeout);
    }, []);
    warn({
      condition: Number(startingHeight) > 0 && !!unmountOnExit,
      message: `startingHeight and unmountOnExit are mutually exclusive. You can't use them together`
    });
    const hasStartingHeight = parseFloat(startingHeight.toString()) > 0;
    const custom = {
      startingHeight,
      endingHeight,
      animateOpacity,
      transition: !mounted ? { enter: { duration: 0 } } : transition,
      transitionEnd: {
        enter: transitionEnd == null ? void 0 : transitionEnd.enter,
        exit: unmountOnExit ? transitionEnd == null ? void 0 : transitionEnd.exit : {
          ...transitionEnd == null ? void 0 : transitionEnd.exit,
          display: hasStartingHeight ? "block" : "none"
        }
      }
    };
    const show = unmountOnExit ? isOpen : true;
    const animate = isOpen || unmountOnExit ? "enter" : "exit";
    return /* @__PURE__ */ jsx(AnimatePresence, { initial: false, custom, children: show && /* @__PURE__ */ jsx(
      motion.div,
      {
        ref,
        ...rest,
        className: cx("chakra-collapse", className),
        style: {
          overflow: "hidden",
          display: "block",
          ...style
        },
        custom,
        variants,
        initial: unmountOnExit ? "exit" : false,
        animate,
        exit: "exit"
      }
    ) });
  }
);
Collapse.displayName = "Collapse";

export {
  Collapse
};
//# sourceMappingURL=chunk-RKXMPHPI.mjs.map