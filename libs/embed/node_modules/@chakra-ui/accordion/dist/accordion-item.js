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

// src/accordion-item.tsx
var accordion_item_exports = {};
__export(accordion_item_exports, {
  AccordionItem: () => AccordionItem
});
module.exports = __toCommonJS(accordion_item_exports);
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

// src/accordion-item.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AccordionItem = (0, import_system.forwardRef)(
  function AccordionItem2(props, ref) {
    const { children, className } = props;
    const { htmlProps, ...context } = useAccordionItem(props);
    const styles = useAccordionStyles();
    const containerStyles = {
      ...styles.container,
      overflowAnchor: "none"
    };
    const ctx = (0, import_react2.useMemo)(() => context, [context]);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItemProvider, { value: ctx, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        ...htmlProps,
        className: (0, import_shared_utils2.cx)("chakra-accordion__item", className),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccordionItem
});
//# sourceMappingURL=accordion-item.js.map