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

// src/use-disclosure.ts
var use_disclosure_exports = {};
__export(use_disclosure_exports, {
  useDisclosure: () => useDisclosure
});
module.exports = __toCommonJS(use_disclosure_exports);
var import_utils3 = require("@chakra-ui/utils");

// src/use-controllable.ts
var import_utils2 = require("@chakra-ui/utils");
var import_react3 = require("react");

// src/use-callback-ref.ts
var import_react2 = require("react");

// src/use-safe-layout-effect.ts
var import_utils = require("@chakra-ui/utils");
var import_react = require("react");
var useSafeLayoutEffect = import_utils.isBrowser ? import_react.useLayoutEffect : import_react.useEffect;

// src/use-callback-ref.ts
function useCallbackRef(fn, deps = []) {
  const ref = (0, import_react2.useRef)(fn);
  useSafeLayoutEffect(() => {
    ref.current = fn;
  });
  return (0, import_react2.useCallback)((...args) => {
    var _a;
    return (_a = ref.current) == null ? void 0 : _a.call(ref, ...args);
  }, deps);
}

// src/use-controllable.ts
function useControllableProp(prop, state) {
  const isControlled = prop !== void 0;
  const value = isControlled && typeof prop !== "undefined" ? prop : state;
  return [isControlled, value];
}

// src/use-id.ts
var import_react4 = require("react");
function useId(idProp, prefix) {
  const id = (0, import_react4.useId)();
  return (0, import_react4.useMemo)(
    () => idProp || [prefix, id].filter(Boolean).join("-"),
    [idProp, prefix, id]
  );
}

// src/use-disclosure.ts
var import_react5 = require("react");
function useDisclosure(props = {}) {
  const {
    onClose: onCloseProp,
    onOpen: onOpenProp,
    isOpen: isOpenProp,
    id: idProp
  } = props;
  const onOpenPropCallbackRef = useCallbackRef(onOpenProp);
  const onClosePropCallbackRef = useCallbackRef(onCloseProp);
  const [isOpenState, setIsOpen] = (0, import_react5.useState)(props.defaultIsOpen || false);
  const [isControlled, isOpen] = useControllableProp(isOpenProp, isOpenState);
  const id = useId(idProp, "disclosure");
  const onClose = (0, import_react5.useCallback)(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    onClosePropCallbackRef == null ? void 0 : onClosePropCallbackRef();
  }, [isControlled, onClosePropCallbackRef]);
  const onOpen = (0, import_react5.useCallback)(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    onOpenPropCallbackRef == null ? void 0 : onOpenPropCallbackRef();
  }, [isControlled, onOpenPropCallbackRef]);
  const onToggle = (0, import_react5.useCallback)(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onOpen, onClose]);
  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
    getButtonProps: (props2 = {}) => ({
      ...props2,
      "aria-expanded": isOpen,
      "aria-controls": id,
      onClick: (0, import_utils3.callAllHandlers)(props2.onClick, onToggle)
    }),
    getDisclosureProps: (props2 = {}) => ({
      ...props2,
      hidden: !isOpen,
      id
    })
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDisclosure
});
