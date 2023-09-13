'use client'

// src/popover-context.ts
import { createContext } from "@chakra-ui/react-context";
var [PopoverProvider, usePopoverContext] = createContext({
  name: "PopoverContext",
  errorMessage: "usePopoverContext: `context` is undefined. Seems you forgot to wrap all popover components within `<Popover />`"
});
var [PopoverStylesProvider, usePopoverStyles] = createContext({
  name: `PopoverStylesContext`,
  errorMessage: `usePopoverStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Popover />" `
});

export {
  PopoverProvider,
  usePopoverContext,
  PopoverStylesProvider,
  usePopoverStyles
};
//# sourceMappingURL=chunk-Z3POGKNI.mjs.map