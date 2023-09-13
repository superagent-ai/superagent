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

// src/accordion-icon.tsx
var accordion_icon_exports = {};
__export(accordion_icon_exports, {
  AccordionIcon: () => AccordionIcon
});
module.exports = __toCommonJS(accordion_icon_exports);
var import_icon = require("@chakra-ui/icon");
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

// src/accordion-icon.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function AccordionIcon(props) {
  const { isOpen, isDisabled } = useAccordionItemContext();
  const { reduceMotion } = useAccordionContext();
  const _className = (0, import_shared_utils2.cx)("chakra-accordion__icon", props.className);
  const styles = useAccordionStyles();
  const iconStyles = {
    opacity: isDisabled ? 0.4 : 1,
    transform: isOpen ? "rotate(-180deg)" : void 0,
    transition: reduceMotion ? void 0 : "transform 0.2s",
    transformOrigin: "center",
    ...styles.icon
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_icon.Icon,
    {
      viewBox: "0 0 24 24",
      "aria-hidden": true,
      className: _className,
      __css: iconStyles,
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccordionIcon
});
//# sourceMappingURL=accordion-icon.js.map