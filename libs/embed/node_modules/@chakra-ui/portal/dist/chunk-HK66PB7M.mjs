'use client'

// src/portal-manager.tsx
import { createContext } from "@chakra-ui/react-context";
import { jsx } from "react/jsx-runtime";
var [PortalManagerContextProvider, usePortalManager] = createContext({
  strict: false,
  name: "PortalManagerContext"
});
function PortalManager(props) {
  const { children, zIndex } = props;
  return /* @__PURE__ */ jsx(PortalManagerContextProvider, { value: { zIndex }, children });
}
PortalManager.displayName = "PortalManager";

export {
  usePortalManager,
  PortalManager
};
//# sourceMappingURL=chunk-HK66PB7M.mjs.map