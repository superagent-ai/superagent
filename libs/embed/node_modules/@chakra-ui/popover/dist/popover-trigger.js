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

// src/popover-trigger.tsx
var popover_trigger_exports = {};
__export(popover_trigger_exports, {
  PopoverTrigger: () => PopoverTrigger
});
module.exports = __toCommonJS(popover_trigger_exports);
var import_react = require("react");

// src/popover-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [PopoverProvider, usePopoverContext] = (0, import_react_context.createContext)({
  name: "PopoverContext",
  errorMessage: "usePopoverContext: `context` is undefined. Seems you forgot to wrap all popover components within `<Popover />`"
});
var [PopoverStylesProvider, usePopoverStyles] = (0, import_react_context.createContext)({
  name: `PopoverStylesContext`,
  errorMessage: `usePopoverStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Popover />" `
});

// src/popover-trigger.tsx
function PopoverTrigger(props) {
  const child = import_react.Children.only(props.children);
  const { getTriggerProps } = usePopoverContext();
  return (0, import_react.cloneElement)(child, getTriggerProps(child.props, child.ref));
}
PopoverTrigger.displayName = "PopoverTrigger";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PopoverTrigger
});
//# sourceMappingURL=popover-trigger.js.map