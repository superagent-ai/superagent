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
  Popover: () => Popover,
  PopoverAnchor: () => PopoverAnchor,
  PopoverArrow: () => PopoverArrow,
  PopoverBody: () => PopoverBody,
  PopoverCloseButton: () => PopoverCloseButton,
  PopoverContent: () => PopoverContent,
  PopoverFooter: () => PopoverFooter,
  PopoverHeader: () => PopoverHeader,
  PopoverTrigger: () => PopoverTrigger,
  usePopover: () => usePopover,
  usePopoverContext: () => usePopoverContext,
  usePopoverStyles: () => usePopoverStyles
});
module.exports = __toCommonJS(src_exports);

// src/popover.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");

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

// src/use-popover.ts
var import_react_use_animation_state = require("@chakra-ui/react-use-animation-state");
var import_react_use_focus_on_pointer_down = require("@chakra-ui/react-use-focus-on-pointer-down");
var import_react_use_focus_effect = require("@chakra-ui/react-use-focus-effect");
var import_react_use_disclosure = require("@chakra-ui/react-use-disclosure");
var import_popper = require("@chakra-ui/popper");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_lazy_utils = require("@chakra-ui/lazy-utils");
var import_react = require("react");
var TRIGGER = {
  click: "click",
  hover: "hover"
};
function usePopover(props = {}) {
  const {
    closeOnBlur = true,
    closeOnEsc = true,
    initialFocusRef,
    id,
    returnFocusOnClose = true,
    autoFocus = true,
    arrowSize,
    arrowShadowColor,
    trigger = TRIGGER.click,
    openDelay = 200,
    closeDelay = 200,
    isLazy,
    lazyBehavior = "unmount",
    computePositionOnMount,
    ...popperProps
  } = props;
  const { isOpen, onClose, onOpen, onToggle } = (0, import_react_use_disclosure.useDisclosure)(props);
  const anchorRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const popoverRef = (0, import_react.useRef)(null);
  const isHoveringRef = (0, import_react.useRef)(false);
  const hasBeenOpened = (0, import_react.useRef)(false);
  if (isOpen) {
    hasBeenOpened.current = true;
  }
  const [hasHeader, setHasHeader] = (0, import_react.useState)(false);
  const [hasBody, setHasBody] = (0, import_react.useState)(false);
  const uuid = (0, import_react.useId)();
  const uid = id != null ? id : uuid;
  const [triggerId, popoverId, headerId, bodyId] = [
    "popover-trigger",
    "popover-content",
    "popover-header",
    "popover-body"
  ].map((id2) => `${id2}-${uid}`);
  const {
    referenceRef,
    getArrowProps,
    getPopperProps,
    getArrowInnerProps,
    forceUpdate
  } = (0, import_popper.usePopper)({
    ...popperProps,
    enabled: isOpen || !!computePositionOnMount
  });
  const animated = (0, import_react_use_animation_state.useAnimationState)({ isOpen, ref: popoverRef });
  (0, import_react_use_focus_on_pointer_down.useFocusOnPointerDown)({
    enabled: isOpen,
    ref: triggerRef
  });
  (0, import_react_use_focus_effect.useFocusOnHide)(popoverRef, {
    focusRef: triggerRef,
    visible: isOpen,
    shouldFocus: returnFocusOnClose && trigger === TRIGGER.click
  });
  (0, import_react_use_focus_effect.useFocusOnShow)(popoverRef, {
    focusRef: initialFocusRef,
    visible: isOpen,
    shouldFocus: autoFocus && trigger === TRIGGER.click
  });
  const shouldRenderChildren = (0, import_lazy_utils.lazyDisclosure)({
    wasSelected: hasBeenOpened.current,
    enabled: isLazy,
    mode: lazyBehavior,
    isSelected: animated.present
  });
  const getPopoverProps = (0, import_react.useCallback)(
    (props2 = {}, _ref = null) => {
      const popoverProps = {
        ...props2,
        style: {
          ...props2.style,
          transformOrigin: import_popper.popperCSSVars.transformOrigin.varRef,
          [import_popper.popperCSSVars.arrowSize.var]: arrowSize ? `${arrowSize}px` : void 0,
          [import_popper.popperCSSVars.arrowShadowColor.var]: arrowShadowColor
        },
        ref: (0, import_react_use_merge_refs.mergeRefs)(popoverRef, _ref),
        children: shouldRenderChildren ? props2.children : null,
        id: popoverId,
        tabIndex: -1,
        role: "dialog",
        onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, (event) => {
          if (closeOnEsc && event.key === "Escape") {
            onClose();
          }
        }),
        onBlur: (0, import_shared_utils.callAllHandlers)(props2.onBlur, (event) => {
          const relatedTarget = getRelatedTarget(event);
          const targetIsPopover = contains(popoverRef.current, relatedTarget);
          const targetIsTrigger = contains(triggerRef.current, relatedTarget);
          const isValidBlur = !targetIsPopover && !targetIsTrigger;
          if (isOpen && closeOnBlur && isValidBlur) {
            onClose();
          }
        }),
        "aria-labelledby": hasHeader ? headerId : void 0,
        "aria-describedby": hasBody ? bodyId : void 0
      };
      if (trigger === TRIGGER.hover) {
        popoverProps.role = "tooltip";
        popoverProps.onMouseEnter = (0, import_shared_utils.callAllHandlers)(props2.onMouseEnter, () => {
          isHoveringRef.current = true;
        });
        popoverProps.onMouseLeave = (0, import_shared_utils.callAllHandlers)(
          props2.onMouseLeave,
          (event) => {
            if (event.nativeEvent.relatedTarget === null) {
              return;
            }
            isHoveringRef.current = false;
            setTimeout(() => onClose(), closeDelay);
          }
        );
      }
      return popoverProps;
    },
    [
      shouldRenderChildren,
      popoverId,
      hasHeader,
      headerId,
      hasBody,
      bodyId,
      trigger,
      closeOnEsc,
      onClose,
      isOpen,
      closeOnBlur,
      closeDelay,
      arrowShadowColor,
      arrowSize
    ]
  );
  const getPopoverPositionerProps = (0, import_react.useCallback)(
    (props2 = {}, forwardedRef = null) => getPopperProps(
      {
        ...props2,
        style: {
          visibility: isOpen ? "visible" : "hidden",
          ...props2.style
        }
      },
      forwardedRef
    ),
    [isOpen, getPopperProps]
  );
  const getAnchorProps = (0, import_react.useCallback)(
    (props2, _ref = null) => {
      return {
        ...props2,
        // If anchor is rendered, it is used as reference.
        ref: (0, import_react_use_merge_refs.mergeRefs)(_ref, anchorRef, referenceRef)
      };
    },
    [anchorRef, referenceRef]
  );
  const openTimeout = (0, import_react.useRef)();
  const closeTimeout = (0, import_react.useRef)();
  const maybeReferenceRef = (0, import_react.useCallback)(
    (node) => {
      if (anchorRef.current == null) {
        referenceRef(node);
      }
    },
    [referenceRef]
  );
  const getTriggerProps = (0, import_react.useCallback)(
    (props2 = {}, _ref = null) => {
      const triggerProps = {
        ...props2,
        ref: (0, import_react_use_merge_refs.mergeRefs)(triggerRef, _ref, maybeReferenceRef),
        id: triggerId,
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": popoverId
      };
      if (trigger === TRIGGER.click) {
        triggerProps.onClick = (0, import_shared_utils.callAllHandlers)(props2.onClick, onToggle);
      }
      if (trigger === TRIGGER.hover) {
        triggerProps.onFocus = (0, import_shared_utils.callAllHandlers)(props2.onFocus, () => {
          if (openTimeout.current === void 0) {
            onOpen();
          }
        });
        triggerProps.onBlur = (0, import_shared_utils.callAllHandlers)(props2.onBlur, (event) => {
          const relatedTarget = getRelatedTarget(event);
          const isValidBlur = !contains(popoverRef.current, relatedTarget);
          if (isOpen && closeOnBlur && isValidBlur) {
            onClose();
          }
        });
        triggerProps.onKeyDown = (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, (event) => {
          if (event.key === "Escape") {
            onClose();
          }
        });
        triggerProps.onMouseEnter = (0, import_shared_utils.callAllHandlers)(props2.onMouseEnter, () => {
          isHoveringRef.current = true;
          openTimeout.current = window.setTimeout(() => onOpen(), openDelay);
        });
        triggerProps.onMouseLeave = (0, import_shared_utils.callAllHandlers)(props2.onMouseLeave, () => {
          isHoveringRef.current = false;
          if (openTimeout.current) {
            clearTimeout(openTimeout.current);
            openTimeout.current = void 0;
          }
          closeTimeout.current = window.setTimeout(() => {
            if (isHoveringRef.current === false) {
              onClose();
            }
          }, closeDelay);
        });
      }
      return triggerProps;
    },
    [
      triggerId,
      isOpen,
      popoverId,
      trigger,
      maybeReferenceRef,
      onToggle,
      onOpen,
      closeOnBlur,
      onClose,
      openDelay,
      closeDelay
    ]
  );
  (0, import_react.useEffect)(() => {
    return () => {
      if (openTimeout.current) {
        clearTimeout(openTimeout.current);
      }
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);
  const getHeaderProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      id: headerId,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, (node) => {
        setHasHeader(!!node);
      })
    }),
    [headerId]
  );
  const getBodyProps = (0, import_react.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      id: bodyId,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, (node) => {
        setHasBody(!!node);
      })
    }),
    [bodyId]
  );
  return {
    forceUpdate,
    isOpen,
    onAnimationComplete: animated.onComplete,
    onClose,
    getAnchorProps,
    getArrowProps,
    getArrowInnerProps,
    getPopoverPositionerProps,
    getPopoverProps,
    getTriggerProps,
    getHeaderProps,
    getBodyProps
  };
}
function contains(parent, child) {
  return parent === child || (parent == null ? void 0 : parent.contains(child));
}
function getRelatedTarget(event) {
  var _a;
  const activeEl = event.currentTarget.ownerDocument.activeElement;
  return (_a = event.relatedTarget) != null ? _a : activeEl;
}

// src/popover.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Popover(props) {
  const styles = (0, import_system.useMultiStyleConfig)("Popover", props);
  const { children, ...rest } = (0, import_system.omitThemingProps)(props);
  const theme = (0, import_system.useTheme)();
  const context = usePopover({ ...rest, direction: theme.direction });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverProvider, { value: context, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverStylesProvider, { value: styles, children: (0, import_shared_utils2.runIfFn)(children, {
    isOpen: context.isOpen,
    onClose: context.onClose,
    forceUpdate: context.forceUpdate
  }) }) });
}
Popover.displayName = "Popover";

// src/popover-anchor.tsx
var import_react2 = require("react");
function PopoverAnchor(props) {
  const child = import_react2.Children.only(props.children);
  const { getAnchorProps } = usePopoverContext();
  return (0, import_react2.cloneElement)(child, getAnchorProps(child.props, child.ref));
}
PopoverAnchor.displayName = "PopoverAnchor";

// src/popover-arrow.tsx
var import_system2 = require("@chakra-ui/system");
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
var resolveVar = (scale, value) => value ? `${scale}.${value}, ${value}` : void 0;
function PopoverArrow(props) {
  var _a;
  const { bg, bgColor, backgroundColor, shadow, boxShadow, shadowColor } = props;
  const { getArrowProps, getArrowInnerProps } = usePopoverContext();
  const styles = usePopoverStyles();
  const arrowBg = (_a = bg != null ? bg : bgColor) != null ? _a : backgroundColor;
  const arrowShadow = shadow != null ? shadow : boxShadow;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system2.chakra.div,
    {
      ...getArrowProps(),
      className: "chakra-popover__arrow-positioner",
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_system2.chakra.div,
        {
          className: (0, import_shared_utils3.cx)("chakra-popover__arrow", props.className),
          ...getArrowInnerProps(props),
          __css: {
            "--popper-arrow-shadow-color": resolveVar("colors", shadowColor),
            "--popper-arrow-bg": resolveVar("colors", arrowBg),
            "--popper-arrow-shadow": resolveVar("shadows", arrowShadow),
            ...styles.arrow
          }
        }
      )
    }
  );
}
PopoverArrow.displayName = "PopoverArrow";

// src/popover-body.tsx
var import_system3 = require("@chakra-ui/system");
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var PopoverBody = (0, import_system3.forwardRef)(
  function PopoverBody2(props, ref) {
    const { getBodyProps } = usePopoverContext();
    const styles = usePopoverStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_system3.chakra.div,
      {
        ...getBodyProps(props, ref),
        className: (0, import_shared_utils4.cx)("chakra-popover__body", props.className),
        __css: styles.body
      }
    );
  }
);
PopoverBody.displayName = "PopoverBody";

// src/popover-close-button.tsx
var import_close_button = require("@chakra-ui/close-button");
var import_system4 = require("@chakra-ui/system");
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_jsx_runtime4 = require("react/jsx-runtime");
var PopoverCloseButton = (0, import_system4.forwardRef)(
  function PopoverCloseButton2(props, ref) {
    const { onClose } = usePopoverContext();
    const styles = usePopoverStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_close_button.CloseButton,
      {
        size: "sm",
        onClick: onClose,
        className: (0, import_shared_utils5.cx)("chakra-popover__close-btn", props.className),
        __css: styles.closeButton,
        ref,
        ...props
      }
    );
  }
);
PopoverCloseButton.displayName = "PopoverCloseButton";

// src/popover-content.tsx
var import_shared_utils6 = require("@chakra-ui/shared-utils");
var import_system6 = require("@chakra-ui/system");

// src/popover-transition.tsx
var import_system5 = require("@chakra-ui/system");
var import_framer_motion = require("framer-motion");
var import_jsx_runtime5 = require("react/jsx-runtime");
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
var MotionSection = (0, import_system5.chakra)(import_framer_motion.motion.section);
var PopoverTransition = (0, import_system5.forwardRef)(function PopoverTransition2(props, ref) {
  const { variants = scaleFade, ...rest } = props;
  const { isOpen } = usePopoverContext();
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var import_jsx_runtime6 = require("react/jsx-runtime");
var PopoverContent = (0, import_system6.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_system6.chakra.div,
      {
        ...getPopoverPositionerProps(rootProps),
        __css: styles.popper,
        className: "chakra-popover__popper",
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          PopoverTransition,
          {
            ...motionProps,
            ...getPopoverProps(contentProps, ref),
            onAnimationComplete: (0, import_shared_utils6.callAll)(
              onAnimationComplete,
              contentProps.onAnimationComplete
            ),
            className: (0, import_shared_utils6.cx)("chakra-popover__content", props.className),
            __css: contentStyles
          }
        )
      }
    );
  }
);
PopoverContent.displayName = "PopoverContent";

// src/popover-footer.tsx
var import_system7 = require("@chakra-ui/system");
var import_shared_utils7 = require("@chakra-ui/shared-utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
function PopoverFooter(props) {
  const styles = usePopoverStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_system7.chakra.footer,
    {
      ...props,
      className: (0, import_shared_utils7.cx)("chakra-popover__footer", props.className),
      __css: styles.footer
    }
  );
}
PopoverFooter.displayName = "PopoverFooter";

// src/popover-header.tsx
var import_system8 = require("@chakra-ui/system");
var import_shared_utils8 = require("@chakra-ui/shared-utils");
var import_jsx_runtime8 = require("react/jsx-runtime");
var PopoverHeader = (0, import_system8.forwardRef)(
  function PopoverHeader2(props, ref) {
    const { getHeaderProps } = usePopoverContext();
    const styles = usePopoverStyles();
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      import_system8.chakra.header,
      {
        ...getHeaderProps(props, ref),
        className: (0, import_shared_utils8.cx)("chakra-popover__header", props.className),
        __css: styles.header
      }
    );
  }
);
PopoverHeader.displayName = "PopoverHeader";

// src/popover-trigger.tsx
var import_react3 = require("react");
function PopoverTrigger(props) {
  const child = import_react3.Children.only(props.children);
  const { getTriggerProps } = usePopoverContext();
  return (0, import_react3.cloneElement)(child, getTriggerProps(child.props, child.ref));
}
PopoverTrigger.displayName = "PopoverTrigger";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  usePopover,
  usePopoverContext,
  usePopoverStyles
});
//# sourceMappingURL=index.js.map