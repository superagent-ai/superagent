'use client'

// src/step-context.tsx
import { createContext } from "@chakra-ui/react-context";
import { createStylesContext } from "@chakra-ui/system";
var [StepContextProvider, useStepContext] = createContext(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = createStylesContext("Stepper");

export {
  StepContextProvider,
  useStepContext,
  StepperStylesProvider,
  useStepperStyles
};
//# sourceMappingURL=chunk-5JULEEQD.mjs.map