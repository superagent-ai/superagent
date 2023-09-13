'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Collapse: () => Collapse,
  EASINGS: () => TRANSITION_EASINGS,
  Fade: () => Fade,
  ScaleFade: () => ScaleFade,
  Slide: () => Slide,
  SlideFade: () => SlideFade,
  fadeConfig: () => fadeConfig,
  getSlideTransition: () => getSlideTransition,
  scaleFadeConfig: () => scaleFadeConfig,
  slideFadeConfig: () => slideFadeConfig,
  withDelay: () => withDelay
});
module.exports = __toCommonJS(src_exports);

// src/collapse.tsx
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_framer_motion = require("framer-motion");
var import_react = require("react");

// src/transition-utils.ts
var TRANSITION_EASINGS = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1]
};
var TRANSITION_VARIANTS = {
  scale: {
    enter: { scale: 1 },
    exit: { scale: 0.95 }
  },
  fade: {
    enter: { opacity: 1 },
    exit: { opacity: 0 }
  },
  pushLeft: {
    enter: { x: "100%" },
    exit: { x: "-30%" }
  },
  pushRight: {
    enter: { x: "-100%" },
    exit: { x: "30%" }
  },
  pushUp: {
    enter: { y: "100%" },
    exit: { y: "-30%" }
  },
  pushDown: {
    enter: { y: "-100%" },
    exit: { y: "30%" }
  },
  slideLeft: {
    position: { left: 0, top: 0, bottom: 0, width: "100%" },
    enter: { x: 0, y: 0 },
    exit: { x: "-100%", y: 0 }
  },
  slideRight: {
    position: { right: 0, top: 0, bottom: 0, width: "100%" },
    enter: { x: 0, y: 0 },
    exit: { x: "100%", y: 0 }
  },
  slideUp: {
    position: { top: 0, left: 0, right: 0, maxWidth: "100vw" },
    enter: { x: 0, y: 0 },
    exit: { x: 0, y: "-100%" }
  },
  slideDown: {
    position: { bottom: 0, left: 0, right: 0, maxWidth: "100vw" },
    enter: { x: 0, y: 0 },
    exit: { x: 0, y: "100%" }
  }
};
function getSlideTransition(options) {
  var _a;
  const side = (_a = options == null ? void 0 : options.direction) != null ? _a : "right";
  switch (side) {
    case "right":
      return TRANSITION_VARIANTS.slideRight;
    case "left":
      return TRANSITION_VARIANTS.slideLeft;
    case "bottom":
      return TRANSITION_VARIANTS.slideDown;
    case "top":
      return TRANSITION_VARIANTS.slideUp;
    default:
      return TRANSITION_VARIANTS.slideRight;
  }
}
var TRANSITION_DEFAULTS = {
  enter: {
    duration: 0.2,
    ease: TRANSITION_EASINGS.easeOut
  },
  exit: {
    duration: 0.1,
    ease: TRANSITION_EASINGS.easeIn
  }
};
var withDelay = {
  enter: (transition, delay) => ({
    ...transition,
    delay: typeof delay === "number" ? delay : delay == null ? void 0 : delay["enter"]
  }),
  exit: (transition, delay) => ({
    ...transition,
    delay: typeof delay === "number" ? delay : delay == null ? void 0 : delay["exit"]
  })
};

// src/collapse.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
var Collapse = (0, import_react.forwardRef)(
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
    const [mounted, setMounted] = (0, import_react.useState)(false);
    (0, import_react.useEffect)(() => {
      const timeout = setTimeout(() => {
        setMounted(true);
      });
      return () => clearTimeout(timeout);
    }, []);
    (0, import_shared_utils.warn)({
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_framer_motion.AnimatePresence, { initial: false, custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_framer_motion.motion.div,
      {
        ref,
        ...rest,
        className: (0, import_shared_utils.cx)("chakra-collapse", className),
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

// src/fade.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_framer_motion2 = require("framer-motion");
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var variants2 = {
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
  variants: variants2
};
var Fade = (0, import_react2.forwardRef)(function Fade2(props, ref) {
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_framer_motion2.AnimatePresence, { custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.div,
    {
      ref,
      className: (0, import_shared_utils2.cx)("chakra-fade", className),
      custom,
      ...fadeConfig,
      animate,
      ...rest
    }
  ) });
});
Fade.displayName = "Fade";

// src/scale-fade.tsx
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_framer_motion3 = require("framer-motion");
var import_react3 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var variants3 = {
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
  variants: variants3
};
var ScaleFade = (0, import_react3.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_framer_motion3.motion.div,
      {
        ref,
        className: (0, import_shared_utils3.cx)("chakra-offset-slide", className),
        ...scaleFadeConfig,
        animate,
        custom,
        ...rest
      }
    ) });
  }
);
ScaleFade.displayName = "ScaleFade";

// src/slide.tsx
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_framer_motion4 = require("framer-motion");
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
var variants4 = {
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
var Slide = (0, import_react4.forwardRef)(function Slide2(props, ref) {
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion4.AnimatePresence, { custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_framer_motion4.motion.div,
    {
      ...rest,
      ref,
      initial: "exit",
      className: (0, import_shared_utils4.cx)("chakra-slide", className),
      animate,
      exit: "exit",
      custom,
      variants: variants4,
      style: computedStyle,
      ...motionProps
    }
  ) });
});
Slide.displayName = "Slide";

// src/slide-fade.tsx
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_framer_motion5 = require("framer-motion");
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var variants5 = {
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
  variants: variants5
};
var SlideFade = (0, import_react5.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_framer_motion5.AnimatePresence, { custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      import_framer_motion5.motion.div,
      {
        ref,
        className: (0, import_shared_utils5.cx)("chakra-offset-slide", className),
        custom,
        ...slideFadeConfig,
        animate,
        ...rest
      }
    ) });
  }
);
SlideFade.displayName = "SlideFade";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Collapse,
  EASINGS,
  Fade,
  ScaleFade,
  Slide,
  SlideFade,
  fadeConfig,
  getSlideTransition,
  scaleFadeConfig,
  slideFadeConfig,
  withDelay
});
//# sourceMappingURL=index.js.map