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

// src/popover-content.tsx
var popover_content_exports = {};
__export(popover_content_exports, {
  PopoverContent: () => PopoverContent
});
module.exports = __toCommonJS(popover_content_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

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
var import_system = require("@chakra-ui/system");
var import_framer_motion = require("framer-motion");
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

// src/popover-content.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var PopoverContent = (0, import_system2.forwardRef)(
  function PopoverContent2(props, ref) {
    const { rootProps, motionProps, ...contentProps } = props;
    const { getPopoverProps, getPopoverPositionerProps, onAnimationComplete } = usePopoverContext();
    const styles = usePopoverStyles();
    const contentStyles = {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      ...styles.content
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.div,
      {
        ...getPopoverPositionerProps(rootProps),
        __css: styles.popper,
        className: "chakra-popover__popper",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          PopoverTransition,
          {
            ...motionProps,
            ...getPopoverProps(contentProps, ref),
            onAnimationComplete: (0, import_shared_utils.callAll)(
              onAnimationComplete,
              contentProps.onAnimationComplete
            ),
            className: (0, import_shared_utils.cx)("chakra-popover__content", props.className),
            __css: contentStyles
          }
        )
      }
    );
  }
);
PopoverContent.displayName = "PopoverContent";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PopoverContent
});
//# sourceMappingURL=popover-content.js.map