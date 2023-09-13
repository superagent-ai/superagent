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

// src/use-editable-state.tsx
var use_editable_state_exports = {};
__export(use_editable_state_exports, {
  useEditableState: () => useEditableState
});
module.exports = __toCommonJS(use_editable_state_exports);

// src/editable-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [EditableStylesProvider, useEditableStyles] = (0, import_react_context.createContext)({
  name: `EditableStylesContext`,
  errorMessage: `useEditableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Editable />" `
});
var [EditableProvider, useEditableContext] = (0, import_react_context.createContext)({
  name: "EditableContext",
  errorMessage: "useEditableContext: context is undefined. Seems you forgot to wrap the editable components in `<Editable />`"
});

// src/use-editable-state.tsx
function useEditableState() {
  const { isEditing, onSubmit, onCancel, onEdit, isDisabled } = useEditableContext();
  return {
    isEditing,
    onSubmit,
    onCancel,
    onEdit,
    isDisabled
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEditableState
});
//# sourceMappingURL=use-editable-state.js.map