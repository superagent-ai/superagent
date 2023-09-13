'use client'

// src/editable-context.ts
import { createContext } from "@chakra-ui/react-context";
var [EditableStylesProvider, useEditableStyles] = createContext({
  name: `EditableStylesContext`,
  errorMessage: `useEditableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Editable />" `
});
var [EditableProvider, useEditableContext] = createContext({
  name: "EditableContext",
  errorMessage: "useEditableContext: context is undefined. Seems you forgot to wrap the editable components in `<Editable />`"
});

export {
  EditableStylesProvider,
  useEditableStyles,
  EditableProvider,
  useEditableContext
};
//# sourceMappingURL=chunk-WYY72ITE.mjs.map