'use client'

// src/chakra-provider.tsx
import {
  ChakraProvider as BaseChakraProvider
} from "@chakra-ui/provider";
import { theme as defaultTheme, baseTheme } from "@chakra-ui/theme";
import {
  ToastProvider,
  ToastOptionProvider
} from "@chakra-ui/toast";
import { jsx, jsxs } from "react/jsx-runtime";
var createChakraProvider = (providerTheme) => {
  return function ChakraProvider2({
    children,
    theme = providerTheme,
    toastOptions,
    ...restProps
  }) {
    return /* @__PURE__ */ jsxs(BaseChakraProvider, { theme, ...restProps, children: [
      /* @__PURE__ */ jsx(ToastOptionProvider, { value: toastOptions == null ? void 0 : toastOptions.defaultOptions, children }),
      /* @__PURE__ */ jsx(ToastProvider, { ...toastOptions })
    ] });
  };
};
var ChakraProvider = createChakraProvider(defaultTheme);
var ChakraBaseProvider = createChakraProvider(baseTheme);

export {
  ChakraProvider,
  ChakraBaseProvider
};
//# sourceMappingURL=chunk-QAITB7GG.mjs.map