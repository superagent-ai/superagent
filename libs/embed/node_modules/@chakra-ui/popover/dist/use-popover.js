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

// src/use-popover.ts
var use_popover_exports = {};
__export(use_popover_exports, {
  usePopover: () => usePopover
});
module.exports = __toCommonJS(use_popover_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePopover
});
//# sourceMappingURL=use-popover.js.map