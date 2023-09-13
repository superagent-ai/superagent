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

// src/use-toast.tsx
var use_toast_exports = {};
__export(use_toast_exports, {
  default: () => use_toast_default,
  useToast: () => useToast
});
module.exports = __toCommonJS(use_toast_exports);
var import_system2 = require("@chakra-ui/system");

// src/toast.tsx
var import_alert = require("@chakra-ui/alert");
var import_system = require("@chakra-ui/system");
var import_close_button = require("@chakra-ui/close-button");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/toast.placement.ts
function getToastPlacement(position, dir) {
  var _a;
  const computedPosition = position != null ? position : "bottom";
  const logicals = {
    "top-start": { ltr: "top-left", rtl: "top-right" },
    "top-end": { ltr: "top-right", rtl: "top-left" },
    "bottom-start": { ltr: "bottom-left", rtl: "bottom-right" },
    "bottom-end": { ltr: "bottom-right", rtl: "bottom-left" }
  };
  const logical = logicals[computedPosition];
  return (_a = logical == null ? void 0 : logical[dir]) != null ? _a : computedPosition;
}

// src/toast.utils.ts
var findById = (arr, id) => arr.find((toast) => toast.id === id);
function findToast(toasts, id) {
  const position = getToastPosition(toasts, id);
  const index = position ? toasts[position].findIndex((toast) => toast.id === id) : -1;
  return {
    position,
    index
  };
}
function getToastPosition(toasts, id) {
  for (const [position, values] of Object.entries(toasts)) {
    if (findById(values, id)) {
      return position;
    }
  }
}

// src/toast.store.ts
var initialState = {
  top: [],
  "top-left": [],
  "top-right": [],
  "bottom-left": [],
  bottom: [],
  "bottom-right": []
};
var toastStore = createStore(initialState);
function createStore(initialState2) {
  let state = initialState2;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (setStateFn) => {
    state = setStateFn(state);
    listeners.forEach((l) => l());
  };
  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        setState(() => initialState2);
        listeners.delete(listener);
      };
    },
    /**
     * Delete a toast record at its position
     */
    removeToast: (id, position) => {
      setState((prevState) => ({
        ...prevState,
        // id may be string or number
        // eslint-disable-next-line eqeqeq
        [position]: prevState[position].filter((toast) => toast.id != id)
      }));
    },
    notify: (message, options) => {
      const toast = createToast(message, options);
      const { position, id } = toast;
      setState((prevToasts) => {
        var _a, _b;
        const isTop = position.includes("top");
        const toasts = isTop ? [toast, ...(_a = prevToasts[position]) != null ? _a : []] : [...(_b = prevToasts[position]) != null ? _b : [], toast];
        return {
          ...prevToasts,
          [position]: toasts
        };
      });
      return id;
    },
    update: (id, options) => {
      if (!id)
        return;
      setState((prevState) => {
        const nextState = { ...prevState };
        const { position, index } = findToast(nextState, id);
        if (position && index !== -1) {
          nextState[position][index] = {
            ...nextState[position][index],
            ...options,
            message: createRenderToast(options)
          };
        }
        return nextState;
      });
    },
    closeAll: ({ positions } = {}) => {
      setState((prev) => {
        const allPositions = [
          "bottom",
          "bottom-right",
          "bottom-left",
          "top",
          "top-left",
          "top-right"
        ];
        const positionsToClose = positions != null ? positions : allPositions;
        return positionsToClose.reduce(
          (acc, position) => {
            acc[position] = prev[position].map((toast) => ({
              ...toast,
              requestClose: true
            }));
            return acc;
          },
          { ...prev }
        );
      });
    },
    close: (id) => {
      setState((prevState) => {
        const position = getToastPosition(prevState, id);
        if (!position)
          return prevState;
        return {
          ...prevState,
          [position]: prevState[position].map((toast) => {
            if (toast.id == id) {
              return {
                ...toast,
                requestClose: true
              };
            }
            return toast;
          })
        };
      });
    },
    isActive: (id) => Boolean(findToast(toastStore.getState(), id).position)
  };
}
var counter = 0;
function createToast(message, options = {}) {
  var _a, _b;
  counter += 1;
  const id = (_a = options.id) != null ? _a : counter;
  const position = (_b = options.position) != null ? _b : "bottom";
  return {
    id,
    message,
    position,
    duration: options.duration,
    onCloseComplete: options.onCloseComplete,
    onRequestRemove: () => toastStore.removeToast(String(id), position),
    status: options.status,
    requestClose: false,
    containerStyle: options.containerStyle
  };
}

// src/toast.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Toast = (props) => {
  const {
    status,
    variant = "solid",
    id,
    title,
    isClosable,
    onClose,
    description,
    colorScheme,
    icon
  } = props;
  const ids = id ? {
    root: `toast-${id}`,
    title: `toast-${id}-title`,
    description: `toast-${id}-description`
  } : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_alert.Alert,
    {
      addRole: false,
      status,
      variant,
      id: ids == null ? void 0 : ids.root,
      alignItems: "start",
      borderRadius: "md",
      boxShadow: "lg",
      paddingEnd: 8,
      textAlign: "start",
      width: "auto",
      colorScheme,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_alert.AlertIcon, { children: icon }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_system.chakra.div, { flex: "1", maxWidth: "100%", children: [
          title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_alert.AlertTitle, { id: ids == null ? void 0 : ids.title, children: title }),
          description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_alert.AlertDescription, { id: ids == null ? void 0 : ids.description, display: "block", children: description })
        ] }),
        isClosable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_close_button.CloseButton,
          {
            size: "sm",
            onClick: onClose,
            position: "absolute",
            insetEnd: 1,
            top: 1
          }
        )
      ]
    }
  );
};
function createRenderToast(options = {}) {
  const { render, toastComponent: ToastComponent = Toast } = options;
  const renderToast = (props) => {
    if (typeof render === "function") {
      return render({ ...props, ...options });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastComponent, { ...props, ...options });
  };
  return renderToast;
}
function createToastFn(dir, defaultOptions) {
  const normalizeToastOptions = (options) => {
    var _a;
    return {
      ...defaultOptions,
      ...options,
      position: getToastPlacement(
        (_a = options == null ? void 0 : options.position) != null ? _a : defaultOptions == null ? void 0 : defaultOptions.position,
        dir
      )
    };
  };
  const toast = (options) => {
    const normalizedToastOptions = normalizeToastOptions(options);
    const Message = createRenderToast(normalizedToastOptions);
    return toastStore.notify(Message, normalizedToastOptions);
  };
  toast.update = (id, options) => {
    toastStore.update(id, normalizeToastOptions(options));
  };
  toast.promise = (promise, options) => {
    const id = toast({
      ...options.loading,
      status: "loading",
      duration: null
    });
    promise.then(
      (data) => toast.update(id, {
        status: "success",
        duration: 5e3,
        ...(0, import_shared_utils.runIfFn)(options.success, data)
      })
    ).catch(
      (error) => toast.update(id, {
        status: "error",
        duration: 5e3,
        ...(0, import_shared_utils.runIfFn)(options.error, error)
      })
    );
  };
  toast.closeAll = toastStore.closeAll;
  toast.close = toastStore.close;
  toast.isActive = toastStore.isActive;
  return toast;
}

// src/use-toast.tsx
var import_react2 = require("react");

// src/toast.provider.tsx
var import_framer_motion = require("framer-motion");
var import_portal = require("@chakra-ui/portal");
var import_react = require("react");
var import_react_context = require("@chakra-ui/react-context");
var import_jsx_runtime2 = require("react/jsx-runtime");
var [ToastOptionProvider, useToastOptionContext] = (0, import_react_context.createContext)({
  name: `ToastOptionsContext`,
  strict: false
});

// src/use-toast.tsx
function useToast(options) {
  const { theme } = (0, import_system2.useChakra)();
  const defaultOptions = useToastOptionContext();
  return (0, import_react2.useMemo)(
    () => createToastFn(theme.direction, {
      ...defaultOptions,
      ...options
    }),
    [options, theme.direction, defaultOptions]
  );
}
var use_toast_default = useToast;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useToast
});
//# sourceMappingURL=use-toast.js.map