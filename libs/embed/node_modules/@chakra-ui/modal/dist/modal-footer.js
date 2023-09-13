'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/modal-footer.tsx
var modal_footer_exports = {};
__export(modal_footer_exports, {
  ModalFooter: () => ModalFooter
});
module.exports = __toCommonJS(modal_footer_exports);
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

// src/modal.tsx
var import_portal = require("@chakra-ui/portal");
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var import_framer_motion = require("framer-motion");

// src/use-modal.ts
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_aria_hidden = require("aria-hidden");
var import_react2 = require("react");

// src/modal-manager.ts
var import_react = require("react");
var ModalManager = class {
  constructor() {
    __publicField(this, "modals");
    this.modals = /* @__PURE__ */ new Map();
  }
  add(modal) {
    this.modals.set(modal, this.modals.size + 1);
    return this.modals.size;
  }
  remove(modal) {
    this.modals.delete(modal);
  }
  isTopModal(modal) {
    if (!modal)
      return false;
    return this.modals.get(modal) === this.modals.size;
  }
};
var modalManager = new ModalManager();
function useModalManager(ref, isOpen) {
  const [index, setIndex] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    const node = ref.current;
    if (!node)
      return;
    if (isOpen) {
      const index2 = modalManager.add(node);
      setIndex(index2);
    }
    return () => {
      modalManager.remove(node);
      setIndex(0);
    };
  }, [isOpen, ref]);
  return index;
}

// src/use-modal.ts
function useModal(props) {
  const {
    isOpen,
    onClose,
    id,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    useInert = true,
    onOverlayClick: onOverlayClickProp,
    onEsc
  } = props;
  const dialogRef = (0, import_react2.useRef)(null);
  const overlayRef = (0, import_react2.useRef)(null);
  const [dialogId, headerId, bodyId] = useIds(
    id,
    `chakra-modal`,
    `chakra-modal--header`,
    `chakra-modal--body`
  );
  useAriaHidden(dialogRef, isOpen && useInert);
  const index = useModalManager(dialogRef, isOpen);
  const mouseDownTarget = (0, import_react2.useRef)(null);
  const onMouseDown = (0, import_react2.useCallback)((event) => {
    mouseDownTarget.current = event.target;
  }, []);
  const onKeyDown = (0, import_react2.useCallback)(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (closeOnEsc) {
          onClose == null ? void 0 : onClose();
        }
        onEsc == null ? void 0 : onEsc();
      }
    },
    [closeOnEsc, onClose, onEsc]
  );
  const [headerMounted, setHeaderMounted] = (0, import_react2.useState)(false);
  const [bodyMounted, setBodyMounted] = (0, import_react2.useState)(false);
  const getDialogProps = (0, import_react2.useCallback)(
    (props2 = {}, ref = null) => ({
      role: "dialog",
      ...props2,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, dialogRef),
      id: dialogId,
      tabIndex: -1,
      "aria-modal": true,
      "aria-labelledby": headerMounted ? headerId : void 0,
      "aria-describedby": bodyMounted ? bodyId : void 0,
      onClick: (0, import_shared_utils.callAllHandlers)(
        props2.onClick,
        (event) => event.stopPropagation()
      )
    }),
    [bodyId, bodyMounted, dialogId, headerId, headerMounted]
  );
  const onOverlayClick = (0, import_react2.useCallback)(
    (event) => {
      event.stopPropagation();
      if (mouseDownTarget.current !== event.target)
        return;
      if (!modalManager.isTopModal(dialogRef.current))
        return;
      if (closeOnOverlayClick) {
        onClose == null ? void 0 : onClose();
      }
      onOverlayClickProp == null ? void 0 : onOverlayClickProp();
    },
    [onClose, closeOnOverlayClick, onOverlayClickProp]
  );
  const getDialogContainerProps = (0, import_react2.useCallback)(
    (props2 = {}, ref = null) => ({
      ...props2,
      ref: (0, import_react_use_merge_refs.mergeRefs)(ref, overlayRef),
      onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, onOverlayClick),
      onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDown),
      onMouseDown: (0, import_shared_utils.callAllHandlers)(props2.onMouseDown, onMouseDown)
    }),
    [onKeyDown, onMouseDown, onOverlayClick]
  );
  return {
    isOpen,
    onClose,
    headerId,
    bodyId,
    setBodyMounted,
    setHeaderMounted,
    dialogRef,
    overlayRef,
    getDialogProps,
    getDialogContainerProps,
    index
  };
}
function useAriaHidden(ref, shouldHide) {
  const currentElement = ref.current;
  (0, import_react2.useEffect)(() => {
    if (!ref.current || !shouldHide)
      return void 0;
    return (0, import_aria_hidden.hideOthers)(ref.current);
  }, [shouldHide, ref, currentElement]);
}
function useIds(idProp, ...prefixes) {
  const reactId = (0, import_react2.useId)();
  const id = idProp || reactId;
  return (0, import_react2.useMemo)(() => {
    return prefixes.map((prefix) => `${prefix}-${id}`);
  }, [id, prefixes]);
}

// src/modal.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var [ModalStylesProvider, useModalStyles] = (0, import_react_context.createContext)({
  name: `ModalStylesContext`,
  errorMessage: `useModalStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Modal />" `
});
var [ModalContextProvider, useModalContext] = (0, import_react_context.createContext)({
  strict: true,
  name: "ModalContext",
  errorMessage: "useModalContext: `context` is undefined. Seems you forgot to wrap modal components in `<Modal />`"
});
var Modal = (props) => {
  const modalProps = {
    scrollBehavior: "outside",
    autoFocus: true,
    trapFocus: true,
    returnFocusOnClose: true,
    blockScrollOnMount: true,
    allowPinchZoom: false,
    motionPreset: "scale",
    lockFocusAcrossFrames: true,
    ...props
  };
  const {
    portalProps,
    children,
    autoFocus,
    trapFocus,
    initialFocusRef,
    finalFocusRef,
    returnFocusOnClose,
    blockScrollOnMount,
    allowPinchZoom,
    preserveScrollBarGap,
    motionPreset,
    lockFocusAcrossFrames,
    onCloseComplete
  } = modalProps;
  const styles = (0, import_system.useMultiStyleConfig)("Modal", modalProps);
  const modal = useModal(modalProps);
  const context = {
    ...modal,
    autoFocus,
    trapFocus,
    initialFocusRef,
    finalFocusRef,
    returnFocusOnClose,
    blockScrollOnMount,
    allowPinchZoom,
    preserveScrollBarGap,
    motionPreset,
    lockFocusAcrossFrames
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalContextProvider, { value: context, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_framer_motion.AnimatePresence, { onExitComplete: onCloseComplete, children: context.isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_portal.Portal, { ...portalProps, children }) }) }) });
};
Modal.displayName = "Modal";

// src/modal-footer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ModalFooter = (0, import_system2.forwardRef)(
  (props, ref) => {
    const { className, ...rest } = props;
    const _className = (0, import_shared_utils2.cx)("chakra-modal__footer", className);
    const styles = useModalStyles();
    const footerStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      ...styles.footer
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.footer,
      {
        ref,
        ...rest,
        __css: footerStyles,
        className: _className
      }
    );
  }
);
ModalFooter.displayName = "ModalFooter";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ModalFooter
});
//# sourceMappingURL=modal-footer.js.map