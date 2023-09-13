'use client'

// src/avatar-context.tsx
import { createContext } from "@chakra-ui/react-context";
var [AvatarStylesProvider, useAvatarStyles] = createContext({
  name: `AvatarStylesContext`,
  hookName: `useAvatarStyles`,
  providerName: "<Avatar/>"
});

export {
  AvatarStylesProvider,
  useAvatarStyles
};
//# sourceMappingURL=chunk-RD3LQCU3.mjs.map