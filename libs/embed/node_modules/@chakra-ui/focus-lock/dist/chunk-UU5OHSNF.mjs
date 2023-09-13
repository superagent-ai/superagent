'use client'

// src/focus-lock.tsx
import ReactFocusLock from "react-focus-lock";
import { getAllFocusable } from "@chakra-ui/dom-utils";
import { useCallback } from "react";
import { jsx } from "react/jsx-runtime";
var _a;
var FocusTrap = (_a = ReactFocusLock.default) != null ? _a : ReactFocusLock;
var FocusLock = (props) => {
  const {
    initialFocusRef,
    finalFocusRef,
    contentRef,
    restoreFocus,
    children,
    isDisabled,
    autoFocus,
    persistentFocus,
    lockFocusAcrossFrames
  } = props;
  const onActivation = useCallback(() => {
    if (initialFocusRef == null ? void 0 : initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else if (contentRef == null ? void 0 : contentRef.current) {
      const focusables = getAllFocusable(contentRef.current);
      if (focusables.length === 0) {
        requestAnimationFrame(() => {
          var _a2;
          (_a2 = contentRef.current) == null ? void 0 : _a2.focus();
        });
      }
    }
  }, [initialFocusRef, contentRef]);
  const onDeactivation = useCallback(() => {
    var _a2;
    (_a2 = finalFocusRef == null ? void 0 : finalFocusRef.current) == null ? void 0 : _a2.focus();
  }, [finalFocusRef]);
  const returnFocus = restoreFocus && !finalFocusRef;
  return /* @__PURE__ */ jsx(
    FocusTrap,
    {
      crossFrame: lockFocusAcrossFrames,
      persistentFocus,
      autoFocus,
      disabled: isDisabled,
      onActivation,
      onDeactivation,
      returnFocus,
      children
    }
  );
};
FocusLock.displayName = "FocusLock";
var focus_lock_default = FocusLock;

export {
  FocusLock,
  focus_lock_default
};
//# sourceMappingURL=chunk-UU5OHSNF.mjs.map