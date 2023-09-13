'use client'

// src/use-theme.ts
import { ThemeContext } from "@emotion/react";
import { useContext } from "react";
function useTheme() {
  const theme = useContext(
    ThemeContext
  );
  if (!theme) {
    throw Error(
      "useTheme: `theme` is undefined. Seems you forgot to wrap your app in `<ChakraProvider />` or `<ThemeProvider />`"
    );
  }
  return theme;
}

export {
  useTheme
};
//# sourceMappingURL=chunk-UIGT7YZF.mjs.map