'use client'

// src/accordion-context.ts
import { createDescendantContext } from "@chakra-ui/descendant";
import { createContext } from "@chakra-ui/react-context";
var [AccordionStylesProvider, useAccordionStyles] = createContext({
  name: "AccordionStylesContext",
  hookName: "useAccordionStyles",
  providerName: "<Accordion />"
});
var [AccordionItemProvider, useAccordionItemContext] = createContext({
  name: "AccordionItemContext",
  hookName: "useAccordionItemContext",
  providerName: "<AccordionItem />"
});
var [
  AccordionDescendantsProvider,
  useAccordionDescendantsContext,
  useAccordionDescendants,
  useAccordionDescendant
] = createDescendantContext();

export {
  AccordionStylesProvider,
  useAccordionStyles,
  AccordionItemProvider,
  useAccordionItemContext,
  AccordionDescendantsProvider,
  useAccordionDescendantsContext,
  useAccordionDescendants,
  useAccordionDescendant
};
//# sourceMappingURL=chunk-RUEU7BLR.mjs.map