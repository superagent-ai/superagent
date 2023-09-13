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

// src/accordion-context.ts
var accordion_context_exports = {};
__export(accordion_context_exports, {
  AccordionDescendantsProvider: () => AccordionDescendantsProvider,
  AccordionItemProvider: () => AccordionItemProvider,
  AccordionStylesProvider: () => AccordionStylesProvider,
  useAccordionDescendant: () => useAccordionDescendant,
  useAccordionDescendants: () => useAccordionDescendants,
  useAccordionDescendantsContext: () => useAccordionDescendantsContext,
  useAccordionItemContext: () => useAccordionItemContext,
  useAccordionStyles: () => useAccordionStyles
});
module.exports = __toCommonJS(accordion_context_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccordionDescendantsProvider,
  AccordionItemProvider,
  AccordionStylesProvider,
  useAccordionDescendant,
  useAccordionDescendants,
  useAccordionDescendantsContext,
  useAccordionItemContext,
  useAccordionStyles
});
//# sourceMappingURL=accordion-context.js.map