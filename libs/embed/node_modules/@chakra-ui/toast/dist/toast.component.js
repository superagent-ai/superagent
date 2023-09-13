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

// src/toast.component.tsx
var toast_component_exports = {};
__export(toast_component_exports, {
  ToastComponent: () => ToastComponent
});
module.exports = __toCommonJS(toast_component_exports);
var import_react_use_timeout = require("@chakra-ui/react-use-timeout");
var import_react_use_update_effect = require("@chakra-ui/react-use-update-effect");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_framer_motion = require("framer-motion");
var import_system = require("@chakra-ui/system");

// src/toast.utils.ts
function getToastStyle(position) {
  const isRighty = position.includes("right");
  const isLefty = position.includes("left");
  let alignItems = "center";
  if (isRighty)
    alignItems = "flex-end";
  if (isLefty)
    alignItems = "flex-start";
  return {
    display: "flex",
    flexDirection: "column",
    alignItems
  };
}

// src/toast.component.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var toastMotionVariants = {
  initial: (props) => {
    const { position } = props;
    const dir = ["top", "bottom"].includes(position) ? "y" : "x";
    let factor = ["top-right", "bottom-right"].includes(position) ? 1 : -1;
    if (position === "bottom")
      factor = 1;
    return {
      opacity: 0,
      [dir]: factor * 24
    };
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};
var ToastComponent = (0, import_react.memo)((props) => {
  const {
    id,
    message,
    onCloseComplete,
    onRequestRemove,
    requestClose = false,
    position = "bottom",
    duration = 5e3,
    containerStyle,
    motionVariants = toastMotionVariants,
    toastSpacing = "0.5rem"
  } = props;
  const [delay, setDelay] = (0, import_react.useState)(duration);
  const isPresent = (0, import_framer_motion.useIsPresent)();
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    if (!isPresent) {
      onCloseComplete == null ? void 0 : onCloseComplete();
    }
  }, [isPresent]);
  (0, import_react_use_update_effect.useUpdateEffect)(() => {
    setDelay(duration);
  }, [duration]);
  const onMouseEnter = () => setDelay(null);
  const onMouseLeave = () => setDelay(duration);
  const close = () => {
    if (isPresent)
      onRequestRemove();
  };
  (0, import_react.useEffect)(() => {
    if (isPresent && requestClose) {
      onRequestRemove();
    }
  }, [isPresent, requestClose, onRequestRemove]);
  (0, import_react_use_timeout.useTimeout)(close, delay);
  const containerStyles = (0, import_react.useMemo)(
    () => ({
      pointerEvents: "auto",
      maxWidth: 560,
      minWidth: 300,
      margin: toastSpacing,
      ...containerStyle
    }),
    [containerStyle, toastSpacing]
  );
  const toastStyle = (0, import_react.useMemo)(() => getToastStyle(position), [position]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_framer_motion.motion.div,
    {
      layout: true,
      className: "chakra-toast",
      variants: motionVariants,
      initial: "initial",
      animate: "animate",
      exit: "exit",
      onHoverStart: onMouseEnter,
      onHoverEnd: onMouseLeave,
      custom: { position },
      style: toastStyle,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_system.chakra.div,
        {
          role: "status",
          "aria-atomic": "true",
          className: "chakra-toast__inner",
          __css: containerStyles,
          children: (0, import_shared_utils.runIfFn)(message, { id, onClose: close })
        }
      )
    }
  );
});
ToastComponent.displayName = "ToastComponent";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastComponent
});
//# sourceMappingURL=toast.component.js.map