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

// src/use-clickable.ts
var use_clickable_exports = {};
__export(use_clickable_exports, {
  useClickable: () => useClickable
});
module.exports = __toCommonJS(use_clickable_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");

// src/use-event-listeners.ts
var import_react = require("react");
function useEventListeners() {
  const listeners = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const currentListeners = listeners.current;
  const add = (0, import_react.useCallback)((el, type, listener, options) => {
    listeners.current.set(listener, { type, el, options });
    el.addEventListener(type, listener, options);
  }, []);
  const remove = (0, import_react.useCallback)(
    (el, type, listener, options) => {
      el.removeEventListener(type, listener, options);
      listeners.current.delete(listener);
    },
    []
  );
  (0, import_react.useEffect)(
    () => () => {
      currentListeners.forEach((value, key) => {
        remove(value.el, value.type, key, value.options);
      });
    },
    [remove, currentListeners]
  );
  return { add, remove };
}

// src/use-clickable.ts
var import_react2 = require("react");
function isValidElement(event) {
  const element = event.target;
  const { tagName, isContentEditable } = element;
  return tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== true;
}
function useClickable(props = {}) {
  const {
    ref: htmlRef,
    isDisabled,
    isFocusable,
    clickOnEnter = true,
    clickOnSpace = true,
    onMouseDown,
    onMouseUp,
    onClick,
    onKeyDown,
    onKeyUp,
    tabIndex: tabIndexProp,
    onMouseOver,
    onMouseLeave,
    ...htmlProps
  } = props;
  const [isButton, setIsButton] = (0, import_react2.useState)(true);
  const [isPressed, setIsPressed] = (0, import_react2.useState)(false);
  const listeners = useEventListeners();
  const refCallback = (node) => {
    if (!node)
      return;
    if (node.tagName !== "BUTTON") {
      setIsButton(false);
    }
  };
  const tabIndex = isButton ? tabIndexProp : tabIndexProp || 0;
  const trulyDisabled = isDisabled && !isFocusable;
  const handleClick = (0, import_react2.useCallback)(
    (event) => {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      const self = event.currentTarget;
      self.focus();
      onClick == null ? void 0 : onClick(event);
    },
    [isDisabled, onClick]
  );
  const onDocumentKeyUp = (0, import_react2.useCallback)(
    (e) => {
      if (isPressed && isValidElement(e)) {
        e.preventDefault();
        e.stopPropagation();
        setIsPressed(false);
        listeners.remove(document, "keyup", onDocumentKeyUp, false);
      }
    },
    [isPressed, listeners]
  );
  const handleKeyDown = (0, import_react2.useCallback)(
    (event) => {
      onKeyDown == null ? void 0 : onKeyDown(event);
      if (isDisabled || event.defaultPrevented || event.metaKey) {
        return;
      }
      if (!isValidElement(event.nativeEvent) || isButton)
        return;
      const shouldClickOnEnter = clickOnEnter && event.key === "Enter";
      const shouldClickOnSpace = clickOnSpace && event.key === " ";
      if (shouldClickOnSpace) {
        event.preventDefault();
        setIsPressed(true);
      }
      if (shouldClickOnEnter) {
        event.preventDefault();
        const self = event.currentTarget;
        self.click();
      }
      listeners.add(document, "keyup", onDocumentKeyUp, false);
    },
    [
      isDisabled,
      isButton,
      onKeyDown,
      clickOnEnter,
      clickOnSpace,
      listeners,
      onDocumentKeyUp
    ]
  );
  const handleKeyUp = (0, import_react2.useCallback)(
    (event) => {
      onKeyUp == null ? void 0 : onKeyUp(event);
      if (isDisabled || event.defaultPrevented || event.metaKey)
        return;
      if (!isValidElement(event.nativeEvent) || isButton)
        return;
      const shouldClickOnSpace = clickOnSpace && event.key === " ";
      if (shouldClickOnSpace) {
        event.preventDefault();
        setIsPressed(false);
        const self = event.currentTarget;
        self.click();
      }
    },
    [clickOnSpace, isButton, isDisabled, onKeyUp]
  );
  const onDocumentMouseUp = (0, import_react2.useCallback)(
    (event) => {
      if (event.button !== 0)
        return;
      setIsPressed(false);
      listeners.remove(document, "mouseup", onDocumentMouseUp, false);
    },
    [listeners]
  );
  const handleMouseDown = (0, import_react2.useCallback)(
    (event) => {
      if (event.button !== 0)
        return;
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (!isButton) {
        setIsPressed(true);
      }
      const target = event.currentTarget;
      target.focus({ preventScroll: true });
      listeners.add(document, "mouseup", onDocumentMouseUp, false);
      onMouseDown == null ? void 0 : onMouseDown(event);
    },
    [isDisabled, isButton, onMouseDown, listeners, onDocumentMouseUp]
  );
  const handleMouseUp = (0, import_react2.useCallback)(
    (event) => {
      if (event.button !== 0)
        return;
      if (!isButton) {
        setIsPressed(false);
      }
      onMouseUp == null ? void 0 : onMouseUp(event);
    },
    [onMouseUp, isButton]
  );
  const handleMouseOver = (0, import_react2.useCallback)(
    (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onMouseOver == null ? void 0 : onMouseOver(event);
    },
    [isDisabled, onMouseOver]
  );
  const handleMouseLeave = (0, import_react2.useCallback)(
    (event) => {
      if (isPressed) {
        event.preventDefault();
        setIsPressed(false);
      }
      onMouseLeave == null ? void 0 : onMouseLeave(event);
    },
    [isPressed, onMouseLeave]
  );
  const ref = (0, import_react_use_merge_refs.mergeRefs)(htmlRef, refCallback);
  if (isButton) {
    return {
      ...htmlProps,
      ref,
      type: "button",
      "aria-disabled": trulyDisabled ? void 0 : isDisabled,
      disabled: trulyDisabled,
      onClick: handleClick,
      onMouseDown,
      onMouseUp,
      onKeyUp,
      onKeyDown,
      onMouseOver,
      onMouseLeave
    };
  }
  return {
    ...htmlProps,
    ref,
    role: "button",
    "data-active": (0, import_shared_utils.dataAttr)(isPressed),
    "aria-disabled": isDisabled ? "true" : void 0,
    tabIndex: trulyDisabled ? void 0 : tabIndex,
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
    onMouseOver: handleMouseOver,
    onMouseLeave: handleMouseLeave
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useClickable
});
//# sourceMappingURL=use-clickable.js.map