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
  Accordion: () => Accordion,
  AccordionButton: () => AccordionButton,
  AccordionIcon: () => AccordionIcon,
  AccordionItem: () => AccordionItem,
  AccordionPanel: () => AccordionPanel,
  AccordionProvider: () => AccordionProvider,
  useAccordion: () => useAccordion,
  useAccordionContext: () => useAccordionContext,
  useAccordionItem: () => useAccordionItem,
  useAccordionItemState: () => useAccordionItemState,
  useAccordionStyles: () => useAccordionStyles
});
module.exports = __toCommonJS(src_exports);

// src/accordion.tsx
var import_system = require("@chakra-ui/system");
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_react2 = require("react");

// src/accordion-context.ts
var import_descendant = require("@chakra-ui/descendant");
var import_react_context = require("@chakra-ui/react-context");
var [AccordionStylesProvider, useAccordionStyles] = (0, import_react_context.createContext)({
  name: "AccordionStylesContext",
  hookName: "useAccordionStyles",
  providerName: "<Accordion />"
});
var [AccordionItemProvider, useAccordionItemContext] = (0, import_react_context.createContext)({
  name: "AccordionItemContext",
  hookName: "useAccordionItemContext",
  providerName: "<AccordionItem />"
});
var [
  AccordionDescendantsProvider,
  useAccordionDescendantsContext,
  useAccordionDescendants,
  useAccordionDescendant
] = (0, import_descendant.createDescendantContext)();

// src/use-accordion.ts
var import_react_context2 = require("@chakra-ui/react-context");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
function useAccordion(props) {
  const {
    onChange,
    defaultIndex,
    index: indexProp,
    allowMultiple,
    allowToggle,
    ...htmlProps
  } = props;
  allowMultipleWarning(props);
  allowMultipleAndAllowToggleWarning(props);
  const descendants = useAccordionDescendants();
  const [focusedIndex, setFocusedIndex] = (0, import_react.useState)(-1);
  (0, import_react.useEffect)(() => {
    return () => {
      setFocusedIndex(-1);
    };
  }, []);
  const [index, setIndex] = (0, import_react_use_controllable_state.useControllableState)({
    value: indexProp,
    defaultValue() {
      if (allowMultiple)
        return defaultIndex != null ? defaultIndex : [];
      return defaultIndex != null ? defaultIndex : -1;
    },
    onChange
  });
  const getAccordionItemProps = (idx) => {
    let isOpen = false;
    if (idx !== null) {
      isOpen = Array.isArray(index) ? index.includes(idx) : index === idx;
    }
    const onChange2 = (isOpen2) => {
      if (idx === null)
        return;
      if (allowMultiple && Array.isArray(index)) {
        const nextState = isOpen2 ? index.concat(idx) : index.filter((i) => i !== idx);
        setIndex(nextState);
      } else if (isOpen2) {
        setIndex(idx);
      } else if (allowToggle) {
        setIndex(-1);
      }
    };
    return { isOpen, onChange: onChange2 };
  };
  return {
    index,
    setIndex,
    htmlProps,
    getAccordionItemProps,
    focusedIndex,
    setFocusedIndex,
    descendants
  };
}
var [AccordionProvider, useAccordionContext] = (0, import_react_context2.createContext)({
  name: "AccordionContext",
  hookName: "useAccordionContext",
  providerName: "Accordion"
});
function useAccordionItem(props) {
  const { isDisabled, isFocusable, id, ...htmlProps } = props;
  const { getAccordionItemProps, setFocusedIndex } = useAccordionContext();
  const buttonRef = (0, import_react.useRef)(null);
  const reactId = (0, import_react.useId)();
  const uid = id != null ? id : reactId;
  const buttonId = `accordion-button-${uid}`;
  const panelId = `accordion-panel-${uid}`;
  focusableNotDisabledWarning(props);
  const { register, index, descendants } = useAccordionDescendant({
    disabled: isDisabled && !isFocusable
  });
  const { isOpen, onChange } = getAccordionItemProps(
    index === -1 ? null : index
  );
  warnIfOpenAndDisabled({ isOpen, isDisabled });
  const onOpen = () => {
    onChange == null ? void 0 : onChange(true);
  };
  const onClose = () => {
    onChange == null ? void 0 : onChange(false);
  };
  const onClick = (0, import_react.useCallback)(() => {
    onChange == null ? void 0 : onChange(!isOpen);
    setFocusedIndex(index);
  }, [index, setFocusedIndex, isOpen, onChange]);
  const onKeyDown = (0, import_react.useCallback)(
    (event) => {
      const keyMap = {
        ArrowDown: () => {
          const next = descendants.nextEnabled(index);
          next == null ? void 0 : next.node.focus();
        },
        ArrowUp: () => {
          const prev = descendants.prevEnabled(index);
          prev == null ? void 0 : prev.node.focus();
        },
        Home: () => {
          const first = descendants.firstEnabled();
          first == null ? void 0 : first.node.focus();
        },
        End: () => {
          const last = descendants.lastEnabled();
          last == null ? void 0 : last.node.focus();
        }
      };
      const action = keyMap[event.key];
      if (action) {
        event.preventDefault();
        action(event);
      }
    },
    [descendants, index]
  );
  const onFocus = (0, import_react.useCallback)(() => {
    setFocusedIndex(index);
  }, [setFocusedIndex, index]);
  const getButtonProps = (0, import_react.useCallback)(
    function getButtonProps2(props2 = {}, ref = null) {
      return {
        ...props2,
        type: "button",
        ref: (0, import_react_use_merge_refs.mergeRefs)(register, buttonRef, ref),
        id: buttonId,
        disabled: !!isDisabled,
        "aria-expanded": !!isOpen,
        "aria-controls": panelId,
        onClick: (0, import_shared_utils.callAllHandlers)(props2.onClick, onClick),
        onFocus: (0, import_shared_utils.callAllHandlers)(props2.onFocus, onFocus),
        onKeyDown: (0, import_shared_utils.callAllHandlers)(props2.onKeyDown, onKeyDown)
      };
    },
    [
      buttonId,
      isDisabled,
      isOpen,
      onClick,
      onFocus,
      onKeyDown,
      panelId,
      register
    ]
  );
  const getPanelProps = (0, import_react.useCallback)(
    function getPanelProps2(props2 = {}, ref = null) {
      return {
        ...props2,
        ref,
        role: "region",
        id: panelId,
        "aria-labelledby": buttonId,
        hidden: !isOpen
      };
    },
    [buttonId, isOpen, panelId]
  );
  return {
    isOpen,
    isDisabled,
    isFocusable,
    onOpen,
    onClose,
    getButtonProps,
    getPanelProps,
    htmlProps
  };
}
function allowMultipleWarning(props) {
  const index = props.index || props.defaultIndex;
  const condition = index != null && !Array.isArray(index) && props.allowMultiple;
  (0, import_shared_utils.warn)({
    condition: !!condition,
    message: `If 'allowMultiple' is passed, then 'index' or 'defaultIndex' must be an array. You passed: ${typeof index},`
  });
}
function allowMultipleAndAllowToggleWarning(props) {
  (0, import_shared_utils.warn)({
    condition: !!(props.allowMultiple && props.allowToggle),
    message: `If 'allowMultiple' is passed, 'allowToggle' will be ignored. Either remove 'allowToggle' or 'allowMultiple' depending on whether you want multiple accordions visible or not`
  });
}
function focusableNotDisabledWarning(props) {
  (0, import_shared_utils.warn)({
    condition: !!(props.isFocusable && !props.isDisabled),
    message: `Using only 'isFocusable', this prop is reserved for situations where you pass 'isDisabled' but you still want the element to receive focus (A11y). Either remove it or pass 'isDisabled' as well.
    `
  });
}
function warnIfOpenAndDisabled(props) {
  (0, import_shared_utils.warn)({
    condition: props.isOpen && !!props.isDisabled,
    message: "Cannot open a disabled accordion item"
  });
}

// src/accordion.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Accordion = (0, import_system.forwardRef)(function Accordion2({ children, reduceMotion, ...props }, ref) {
  const styles = (0, import_system.useMultiStyleConfig)("Accordion", props);
  const ownProps = (0, import_system.omitThemingProps)(props);
  const { htmlProps, descendants, ...context } = useAccordion(ownProps);
  const ctx = (0, import_react2.useMemo)(
    () => ({ ...context, reduceMotion: !!reduceMotion }),
    [context, reduceMotion]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionDescendantsProvider, { value: descendants, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionProvider, { value: ctx, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionStylesProvider, { value: styles, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      ...htmlProps,
      className: (0, import_shared_utils2.cx)("chakra-accordion", props.className),
      __css: styles.root,
      children
    }
  ) }) }) });
});
Accordion.displayName = "Accordion";

// src/accordion-button.tsx
var import_system2 = require("@chakra-ui/system");
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_jsx_runtime2 = require("react/jsx-runtime");
var AccordionButton = (0, import_system2.forwardRef)(
  function AccordionButton2(props, ref) {
    const { getButtonProps } = useAccordionItemContext();
    const buttonProps = getButtonProps(props, ref);
    const styles = useAccordionStyles();
    const buttonStyles = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      outline: 0,
      ...styles.button
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_system2.chakra.button,
      {
        ...buttonProps,
        className: (0, import_shared_utils3.cx)("chakra-accordion__button", props.className),
        __css: buttonStyles
      }
    );
  }
);
AccordionButton.displayName = "AccordionButton";

// src/accordion-icon.tsx
var import_icon = require("@chakra-ui/icon");
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
function AccordionIcon(props) {
  const { isOpen, isDisabled } = useAccordionItemContext();
  const { reduceMotion } = useAccordionContext();
  const _className = (0, import_shared_utils4.cx)("chakra-accordion__icon", props.className);
  const styles = useAccordionStyles();
  const iconStyles = {
    opacity: isDisabled ? 0.4 : 1,
    transform: isOpen ? "rotate(-180deg)" : void 0,
    transition: reduceMotion ? void 0 : "transform 0.2s",
    transformOrigin: "center",
    ...styles.icon
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_icon.Icon,
    {
      viewBox: "0 0 24 24",
      "aria-hidden": true,
      className: _className,
      __css: iconStyles,
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "path",
        {
          fill: "currentColor",
          d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
        }
      )
    }
  );
}
AccordionIcon.displayName = "AccordionIcon";

// src/accordion-item.tsx
var import_system3 = require("@chakra-ui/system");
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var AccordionItem = (0, import_system3.forwardRef)(
  function AccordionItem2(props, ref) {
    const { children, className } = props;
    const { htmlProps, ...context } = useAccordionItem(props);
    const styles = useAccordionStyles();
    const containerStyles = {
      ...styles.container,
      overflowAnchor: "none"
    };
    const ctx = (0, import_react3.useMemo)(() => context, [context]);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AccordionItemProvider, { value: ctx, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_system3.chakra.div,
      {
        ref,
        ...htmlProps,
        className: (0, import_shared_utils5.cx)("chakra-accordion__item", className),
        __css: containerStyles,
        children: typeof children === "function" ? children({
          isExpanded: !!context.isOpen,
          isDisabled: !!context.isDisabled
        }) : children
      }
    ) });
  }
);
AccordionItem.displayName = "AccordionItem";

// src/accordion-panel.tsx
var import_system4 = require("@chakra-ui/system");
var import_transition = require("@chakra-ui/transition");
var import_shared_utils6 = require("@chakra-ui/shared-utils");
var import_jsx_runtime5 = require("react/jsx-runtime");
var AccordionPanel = (0, import_system4.forwardRef)(
  function AccordionPanel2(props, ref) {
    const { className, motionProps, ...rest } = props;
    const { reduceMotion } = useAccordionContext();
    const { getPanelProps, isOpen } = useAccordionItemContext();
    const panelProps = getPanelProps(rest, ref);
    const _className = (0, import_shared_utils6.cx)("chakra-accordion__panel", className);
    const styles = useAccordionStyles();
    if (!reduceMotion) {
      delete panelProps.hidden;
    }
    const child = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_system4.chakra.div, { ...panelProps, __css: styles.panel, className: _className });
    if (!reduceMotion) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_transition.Collapse, { in: isOpen, ...motionProps, children: child });
    }
    return child;
  }
);
AccordionPanel.displayName = "AccordionPanel";

// src/use-accordion-item-state.ts
function useAccordionItemState() {
  const { isOpen, isDisabled, onClose, onOpen } = useAccordionItemContext();
  return { isOpen, onClose, isDisabled, onOpen };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProvider,
  useAccordion,
  useAccordionContext,
  useAccordionItem,
  useAccordionItemState,
  useAccordionStyles
});
//# sourceMappingURL=index.js.map