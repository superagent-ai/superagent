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

// src/scale-fade.tsx
var scale_fade_exports = {};
__export(scale_fade_exports, {
  ScaleFade: () => ScaleFade,
  scaleFadeConfig: () => scaleFadeConfig
});
module.exports = __toCommonJS(scale_fade_exports);
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

// src/scale-fade.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
var ScaleFade = (0, import_react.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_framer_motion.AnimatePresence, { custom, children: show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_framer_motion.motion.div,
      {
        ref,
        className: (0, import_shared_utils.cx)("chakra-offset-slide", className),
        ...scaleFadeConfig,
        animate,
        custom,
        ...rest
      }
    ) });
  }
);
ScaleFade.displayName = "ScaleFade";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ScaleFade,
  scaleFadeConfig
});
//# sourceMappingURL=scale-fade.js.map