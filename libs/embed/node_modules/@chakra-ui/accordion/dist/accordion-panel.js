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

// src/accordion-panel.tsx
var accordion_panel_exports = {};
__export(accordion_panel_exports, {
  AccordionPanel: () => AccordionPanel
});
module.exports = __toCommonJS(accordion_panel_exports);
var import_system = require("@chakra-ui/system");
var import_transition = require("@chakra-ui/transition");
var import_shared_utils2 = require("@chakra-ui/shared-utils");

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

// src/accordion-panel.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AccordionPanel = (0, import_system.forwardRef)(
  function AccordionPanel2(props, ref) {
    const { className, motionProps, ...rest } = props;
    const { reduceMotion } = useAccordionContext();
    const { getPanelProps, isOpen } = useAccordionItemContext();
    const panelProps = getPanelProps(rest, ref);
    const _className = (0, import_shared_utils2.cx)("chakra-accordion__panel", className);
    const styles = useAccordionStyles();
    if (!reduceMotion) {
      delete panelProps.hidden;
    }
    const child = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.div, { ...panelProps, __css: styles.panel, className: _className });
    if (!reduceMotion) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_transition.Collapse, { in: isOpen, ...motionProps, children: child });
    }
    return child;
  }
);
AccordionPanel.displayName = "AccordionPanel";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccordionPanel
});
//# sourceMappingURL=accordion-panel.js.map