'use client'
import {
  CheckIcon,
  InfoIcon,
  WarningIcon
} from "./chunk-NEDBTDT2.mjs";

// src/alert-context.ts
import { createContext } from "@chakra-ui/react-context";
import { Spinner } from "@chakra-ui/spinner";
var [AlertProvider, useAlertContext] = createContext({
  name: "AlertContext",
  hookName: "useAlertContext",
  providerName: "<Alert />"
});
var [AlertStylesProvider, useAlertStyles] = createContext({
  name: `AlertStylesContext`,
  hookName: `useAlertStyles`,
  providerName: "<Alert />"
});
var STATUSES = {
  info: { icon: InfoIcon, colorScheme: "blue" },
  warning: { icon: WarningIcon, colorScheme: "orange" },
  success: { icon: CheckIcon, colorScheme: "green" },
  error: { icon: WarningIcon, colorScheme: "red" },
  loading: { icon: Spinner, colorScheme: "blue" }
};
function getStatusColorScheme(status) {
  return STATUSES[status].colorScheme;
}
function getStatusIcon(status) {
  return STATUSES[status].icon;
}

export {
  AlertProvider,
  useAlertContext,
  AlertStylesProvider,
  useAlertStyles,
  getStatusColorScheme,
  getStatusIcon
};
//# sourceMappingURL=chunk-XCES3W5V.mjs.map