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

// src/popover-transition.tsx
var popover_transition_exports = {};
__export(popover_transition_exports, {
  PopoverTransition: () => PopoverTransition
});
module.exports = __toCommonJS(popover_transition_exports);
var import_system = require("@chakra-ui/system");
var import_framer_motion = require("framer-motion");

// src/popover-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [PopoverProvider, usePopoverContext] = (0, import_react_context.createContext)({
  name: "PopoverContext",
  errorMessage: "usePopoverContext: `context` is undefined. Seems you forgot to wrap all popover components within `<Popover />`"
});
var [PopoverStylesProvider, usePopoverStyles] = (0, import_react_context.createContext)({
  name: `PopoverStylesContext`,
  errorMessage: `usePopoverStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Popover />" `
});

// src/popover-transition.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
var MotionSection = (0, import_system.chakra)(import_framer_motion.motion.section);
var PopoverTransition = (0, import_system.forwardRef)(function PopoverTransition2(props, ref) {
  const { variants = scaleFade, ...rest } = props;
  const { isOpen } = usePopoverContext();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PopoverTransition
});
//# sourceMappingURL=popover-transition.js.map