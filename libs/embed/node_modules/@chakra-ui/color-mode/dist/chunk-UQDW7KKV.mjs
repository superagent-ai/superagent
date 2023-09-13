'use client'

// src/color-mode-context.ts
import { createContext, useContext } from "react";
var ColorModeContext = createContext({});
ColorModeContext.displayName = "ColorModeContext";
function useColorMode() {
  const context = useContext(ColorModeContext);
  if (context === void 0) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}
function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export {
  ColorModeContext,
  useColorMode,
  useColorModeValue
};
//# sourceMappingURL=chunk-UQDW7KKV.mjs.map