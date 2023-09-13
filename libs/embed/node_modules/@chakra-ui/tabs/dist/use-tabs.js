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

// src/use-tabs.ts
var use_tabs_exports = {};
__export(use_tabs_exports, {
  TabsDescendantsProvider: () => TabsDescendantsProvider,
  TabsProvider: () => TabsProvider,
  useTab: () => useTab,
  useTabIndicator: () => useTabIndicator,
  useTabList: () => useTabList,
  useTabPanel: () => useTabPanel,
  useTabPanels: () => useTabPanels,
  useTabs: () => useTabs,
  useTabsContext: () => useTabsContext,
  useTabsDescendant: () => useTabsDescendant,
  useTabsDescendants: () => useTabsDescendants,
  useTabsDescendantsContext: () => useTabsDescendantsContext
});
module.exports = __toCommonJS(use_tabs_exports);
var import_clickable = require("@chakra-ui/clickable");
var import_descendant = require("@chakra-ui/descendant");
var import_react_context = require("@chakra-ui/react-context");
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_use_controllable_state = require("@chakra-ui/react-use-controllable-state");
var import_react_children_utils = require("@chakra-ui/react-children-utils");
var import_react_use_merge_refs = require("@chakra-ui/react-use-merge-refs");
var import_lazy_utils = require("@chakra-ui/lazy-utils");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
var [
  TabsDescendantsProvider,
  useTabsDescendantsContext,
  useTabsDescendants,
  useTabsDescendant
] = (0, import_descendant.createDescendantContext)();
function useTabs(props) {
  var _a;
  const {
    defaultIndex,
    onChange,
    index,
    isManual,
    isLazy,
    lazyBehavior = "unmount",
    orientation = "horizontal",
    direction = "ltr",
    ...htmlProps
  } = props;
  const [focusedIndex, setFocusedIndex] = (0, import_react.useState)(defaultIndex != null ? defaultIndex : 0);
  const [selectedIndex, setSelectedIndex] = (0, import_react_use_controllable_state.useControllableState)({
    defaultValue: defaultIndex != null ? defaultIndex : 0,
    value: index,
    onChange
  });
  (0, import_react.useEffect)(() => {
    if (index != null) {
      setFocusedIndex(index);
    }
  }, [index]);
  const descendants = useTabsDescendants();
  const uuid = (0, import_react.useId)();
  const uid = (_a = props.id) != null ? _a : uuid;
  const id = `tabs-${uid}`;
  return {
    id,
    selectedIndex,
    focusedIndex,
    setSelectedIndex,
    setFocusedIndex,
    isManual,
    isLazy,
    lazyBehavior,
    orientation,
    descendants,
    direction,
    htmlProps
  };
}
var [TabsProvider, useTabsContext] = (0, import_react_context.createContext)({
  name: "TabsContext",
  errorMessage: "useTabsContext: `context` is undefined. Seems you forgot to wrap all tabs components within <Tabs />"
});
function useTabList(props) {
  const { focusedIndex, orientation, direction } = useTabsContext();
  const descendants = useTabsDescendantsContext();
  const onKeyDown = (0, import_react.useCallback)(
    (event) => {
      const nextTab = () => {
        var _a;
        const next = descendants.nextEnabled(focusedIndex);
        if (next)
          (_a = next.node) == null ? void 0 : _a.focus();
      };
      const prevTab = () => {
        var _a;
        const prev = descendants.prevEnabled(focusedIndex);
        if (prev)
          (_a = prev.node) == null ? void 0 : _a.focus();
      };
      const firstTab = () => {
        var _a;
        const first = descendants.firstEnabled();
        if (first)
          (_a = first.node) == null ? void 0 : _a.focus();
      };
      const lastTab = () => {
        var _a;
        const last = descendants.lastEnabled();
        if (last)
          (_a = last.node) == null ? void 0 : _a.focus();
      };
      const isHorizontal = orientation === "horizontal";
      const isVertical = orientation === "vertical";
      const eventKey = event.key;
      const ArrowStart = direction === "ltr" ? "ArrowLeft" : "ArrowRight";
      const ArrowEnd = direction === "ltr" ? "ArrowRight" : "ArrowLeft";
      const keyMap = {
        [ArrowStart]: () => isHorizontal && prevTab(),
        [ArrowEnd]: () => isHorizontal && nextTab(),
        ArrowDown: () => isVertical && nextTab(),
        ArrowUp: () => isVertical && prevTab(),
        Home: firstTab,
        End: lastTab
      };
      const action = keyMap[eventKey];
      if (action) {
        event.preventDefault();
        action(event);
      }
    },
    [descendants, focusedIndex, orientation, direction]
  );
  return {
    ...props,
    role: "tablist",
    "aria-orientation": orientation,
    onKeyDown: (0, import_shared_utils.callAllHandlers)(props.onKeyDown, onKeyDown)
  };
}
function useTab(props) {
  const { isDisabled = false, isFocusable = false, ...htmlProps } = props;
  const { setSelectedIndex, isManual, id, setFocusedIndex, selectedIndex } = useTabsContext();
  const { index, register } = useTabsDescendant({
    disabled: isDisabled && !isFocusable
  });
  const isSelected = index === selectedIndex;
  const onClick = () => {
    setSelectedIndex(index);
  };
  const onFocus = () => {
    setFocusedIndex(index);
    const isDisabledButFocusable = isDisabled && isFocusable;
    const shouldSelect = !isManual && !isDisabledButFocusable;
    if (shouldSelect) {
      setSelectedIndex(index);
    }
  };
  const clickableProps = (0, import_clickable.useClickable)({
    ...htmlProps,
    ref: (0, import_react_use_merge_refs.mergeRefs)(register, props.ref),
    isDisabled,
    isFocusable,
    onClick: (0, import_shared_utils.callAllHandlers)(props.onClick, onClick)
  });
  const type = "button";
  return {
    ...clickableProps,
    id: makeTabId(id, index),
    role: "tab",
    tabIndex: isSelected ? 0 : -1,
    type,
    "aria-selected": isSelected,
    "aria-controls": makeTabPanelId(id, index),
    onFocus: isDisabled ? void 0 : (0, import_shared_utils.callAllHandlers)(props.onFocus, onFocus)
  };
}
var [TabPanelProvider, useTabPanelContext] = (0, import_react_context.createContext)({});
function useTabPanels(props) {
  const context = useTabsContext();
  const { id, selectedIndex } = context;
  const validChildren = (0, import_react_children_utils.getValidChildren)(props.children);
  const children = validChildren.map(
    (child, index) => (0, import_react.createElement)(
      TabPanelProvider,
      {
        key: index,
        value: {
          isSelected: index === selectedIndex,
          id: makeTabPanelId(id, index),
          tabId: makeTabId(id, index),
          selectedIndex
        }
      },
      child
    )
  );
  return { ...props, children };
}
function useTabPanel(props) {
  const { children, ...htmlProps } = props;
  const { isLazy, lazyBehavior } = useTabsContext();
  const { isSelected, id, tabId } = useTabPanelContext();
  const hasBeenSelected = (0, import_react.useRef)(false);
  if (isSelected) {
    hasBeenSelected.current = true;
  }
  const shouldRenderChildren = (0, import_lazy_utils.lazyDisclosure)({
    wasSelected: hasBeenSelected.current,
    isSelected,
    enabled: isLazy,
    mode: lazyBehavior
  });
  return {
    // Puts the tabpanel in the page `Tab` sequence.
    tabIndex: 0,
    ...htmlProps,
    children: shouldRenderChildren ? children : null,
    role: "tabpanel",
    "aria-labelledby": tabId,
    hidden: !isSelected,
    id
  };
}
function useTabIndicator() {
  const context = useTabsContext();
  const descendants = useTabsDescendantsContext();
  const { selectedIndex, orientation } = context;
  const isHorizontal = orientation === "horizontal";
  const isVertical = orientation === "vertical";
  const [rect, setRect] = (0, import_react.useState)(() => {
    if (isHorizontal)
      return { left: 0, width: 0 };
    if (isVertical)
      return { top: 0, height: 0 };
    return void 0;
  });
  const [hasMeasured, setHasMeasured] = (0, import_react.useState)(false);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (selectedIndex == null)
      return;
    const tab = descendants.item(selectedIndex);
    if (tab == null)
      return;
    if (isHorizontal) {
      setRect({ left: tab.node.offsetLeft, width: tab.node.offsetWidth });
    }
    if (isVertical) {
      setRect({ top: tab.node.offsetTop, height: tab.node.offsetHeight });
    }
    const id = requestAnimationFrame(() => {
      setHasMeasured(true);
    });
    return () => {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  }, [selectedIndex, isHorizontal, isVertical, descendants]);
  return {
    position: "absolute",
    transitionProperty: "left, right, top, bottom, height, width",
    transitionDuration: hasMeasured ? "200ms" : "0ms",
    transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
    ...rect
  };
}
function makeTabId(id, index) {
  return `${id}--tab-${index}`;
}
function makeTabPanelId(id, index) {
  return `${id}--tabpanel-${index}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TabsDescendantsProvider,
  TabsProvider,
  useTab,
  useTabIndicator,
  useTabList,
  useTabPanel,
  useTabPanels,
  useTabs,
  useTabsContext,
  useTabsDescendant,
  useTabsDescendants,
  useTabsDescendantsContext
});
//# sourceMappingURL=use-tabs.js.map