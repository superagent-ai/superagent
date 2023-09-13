'use client'
import {
  innerArrow,
  matchWidth,
  positionArrow,
  transformOrigin
} from "./chunk-P4KPSAOW.mjs";
import {
  getPopperPlacement
} from "./chunk-AUJXXV3B.mjs";
import {
  cssVars,
  getEventListenerOptions
} from "./chunk-6WT2JRWX.mjs";

// src/use-popper.ts
import { mergeRefs } from "@chakra-ui/react-use-merge-refs";
import {
  createPopper
} from "@popperjs/core";
import { useCallback, useEffect, useRef } from "react";
function usePopper(props = {}) {
  const {
    enabled = true,
    modifiers,
    placement: placementProp = "bottom",
    strategy = "absolute",
    arrowPadding = 8,
    eventListeners = true,
    offset,
    gutter = 8,
    flip = true,
    boundary = "clippingParents",
    preventOverflow = true,
    matchWidth: matchWidth2,
    direction = "ltr"
  } = props;
  const reference = useRef(null);
  const popper = useRef(null);
  const instance = useRef(null);
  const placement = getPopperPlacement(placementProp, direction);
  const cleanup = useRef(() => {
  });
  const setupPopper = useCallback(() => {
    var _a;
    if (!enabled || !reference.current || !popper.current)
      return;
    (_a = cleanup.current) == null ? void 0 : _a.call(cleanup);
    instance.current = createPopper(reference.current, popper.current, {
      placement,
      modifiers: [
        innerArrow,
        positionArrow,
        transformOrigin,
        {
          ...matchWidth,
          enabled: !!matchWidth2
        },
        {
          name: "eventListeners",
          ...getEventListenerOptions(eventListeners)
        },
        {
          name: "arrow",
          options: { padding: arrowPadding }
        },
        {
          name: "offset",
          options: {
            offset: offset != null ? offset : [0, gutter]
          }
        },
        {
          name: "flip",
          enabled: !!flip,
          options: { padding: 8 }
        },
        {
          name: "preventOverflow",
          enabled: !!preventOverflow,
          options: { boundary }
        },
        // allow users override internal modifiers
        ...modifiers != null ? modifiers : []
      ],
      strategy
    });
    instance.current.forceUpdate();
    cleanup.current = instance.current.destroy;
  }, [
    placement,
    enabled,
    modifiers,
    matchWidth2,
    eventListeners,
    arrowPadding,
    offset,
    gutter,
    flip,
    preventOverflow,
    boundary,
    strategy
  ]);
  useEffect(() => {
    return () => {
      var _a;
      if (!reference.current && !popper.current) {
        (_a = instance.current) == null ? void 0 : _a.destroy();
        instance.current = null;
      }
    };
  }, []);
  const referenceRef = useCallback(
    (node) => {
      reference.current = node;
      setupPopper();
    },
    [setupPopper]
  );
  const getReferenceProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      ref: mergeRefs(referenceRef, ref)
    }),
    [referenceRef]
  );
  const popperRef = useCallback(
    (node) => {
      popper.current = node;
      setupPopper();
    },
    [setupPopper]
  );
  const getPopperProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      ref: mergeRefs(popperRef, ref),
      style: {
        ...props2.style,
        position: strategy,
        minWidth: matchWidth2 ? void 0 : "max-content",
        inset: "0 auto auto 0"
      }
    }),
    [strategy, popperRef, matchWidth2]
  );
  const getArrowProps = useCallback((props2 = {}, ref = null) => {
    const { size, shadowColor, bg, style, ...rest } = props2;
    return {
      ...rest,
      ref,
      "data-popper-arrow": "",
      style: getArrowStyle(props2)
    };
  }, []);
  const getArrowInnerProps = useCallback(
    (props2 = {}, ref = null) => ({
      ...props2,
      ref,
      "data-popper-arrow-inner": ""
    }),
    []
  );
  return {
    update() {
      var _a;
      (_a = instance.current) == null ? void 0 : _a.update();
    },
    forceUpdate() {
      var _a;
      (_a = instance.current) == null ? void 0 : _a.forceUpdate();
    },
    transformOrigin: cssVars.transformOrigin.varRef,
    referenceRef,
    popperRef,
    getPopperProps,
    getArrowProps,
    getArrowInnerProps,
    getReferenceProps
  };
}
function getArrowStyle(props) {
  const { size, shadowColor, bg, style } = props;
  const computedStyle = { ...style, position: "absolute" };
  if (size) {
    computedStyle["--popper-arrow-size"] = size;
  }
  if (shadowColor) {
    computedStyle["--popper-arrow-shadow-color"] = shadowColor;
  }
  if (bg) {
    computedStyle["--popper-arrow-bg"] = bg;
  }
  return computedStyle;
}

export {
  usePopper
};
//# sourceMappingURL=chunk-LUYFNC5G.mjs.map