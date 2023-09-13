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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Portal: () => Portal,
  PortalManager: () => PortalManager,
  usePortalManager: () => usePortalManager
});
module.exports = __toCommonJS(src_exports);

// src/portal-manager.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_jsx_runtime = require("react/jsx-runtime");
var [PortalManagerContextProvider, usePortalManager] = (0, import_react_context.createContext)({
  strict: false,
  name: "PortalManagerContext"
});
function PortalManager(props) {
  const { children, zIndex } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalManagerContextProvider, { value: { zIndex }, children });
}
PortalManager.displayName = "PortalManager";

// src/portal.tsx
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react_context2 = require("@chakra-ui/react-context");
var import_react_dom = require("react-dom");
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var [PortalContextProvider, usePortalContext] = (0, import_react_context2.createContext)({
  strict: false,
  name: "PortalContext"
});
var PORTAL_CLASSNAME = "chakra-portal";
var PORTAL_SELECTOR = `.chakra-portal`;
var Container = (props) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "div",
  {
    className: "chakra-portal-zIndex",
    style: {
      position: "absolute",
      zIndex: props.zIndex,
      top: 0,
      left: 0,
      right: 0
      // NB: Don't add `bottom: 0`, it makes the entire app unusable
      // @see https://github.com/chakra-ui/chakra-ui/issues/3201
    },
    children: props.children
  }
);
var DefaultPortal = (props) => {
  const { appendToParentPortal, children } = props;
  const [tempNode, setTempNode] = (0, import_react.useState)(null);
  const portal = (0, import_react.useRef)(null);
  const [, forceUpdate] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => forceUpdate({}), []);
  const parentPortal = usePortalContext();
  const manager = usePortalManager();
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!tempNode)
      return;
    const doc = tempNode.ownerDocument;
    const host = appendToParentPortal ? parentPortal != null ? parentPortal : doc.body : doc.body;
    if (!host)
      return;
    portal.current = doc.createElement("div");
    portal.current.className = PORTAL_CLASSNAME;
    host.appendChild(portal.current);
    forceUpdate({});
    const portalNode = portal.current;
    return () => {
      if (host.contains(portalNode)) {
        host.removeChild(portalNode);
      }
    };
  }, [tempNode]);
  const _children = (manager == null ? void 0 : manager.zIndex) ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Container, { zIndex: manager == null ? void 0 : manager.zIndex, children }) : children;
  return portal.current ? (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PortalContextProvider, { value: portal.current, children: _children }),
    portal.current
  ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "span",
    {
      ref: (el) => {
        if (el)
          setTempNode(el);
      }
    }
  );
};
var ContainerPortal = (props) => {
  const { children, containerRef, appendToParentPortal } = props;
  const containerEl = containerRef.current;
  const host = containerEl != null ? containerEl : typeof window !== "undefined" ? document.body : void 0;
  const portal = (0, import_react.useMemo)(() => {
    const node = containerEl == null ? void 0 : containerEl.ownerDocument.createElement("div");
    if (node)
      node.className = PORTAL_CLASSNAME;
    return node;
  }, [containerEl]);
  const [, forceUpdate] = (0, import_react.useState)({});
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => forceUpdate({}), []);
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (!portal || !host)
      return;
    host.appendChild(portal);
    return () => {
      host.removeChild(portal);
    };
  }, [portal, host]);
  if (host && portal) {
    return (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PortalContextProvider, { value: appendToParentPortal ? portal : null, children }),
      portal
    );
  }
  return null;
};
function Portal(props) {
  const portalProps = {
    appendToParentPortal: true,
    ...props
  };
  const { containerRef, ...rest } = portalProps;
  return containerRef ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ContainerPortal, { containerRef, ...rest }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DefaultPortal, { ...rest });
}
Portal.className = PORTAL_CLASSNAME;
Portal.selector = PORTAL_SELECTOR;
Portal.displayName = "Portal";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Portal,
  PortalManager,
  usePortalManager
});
//# sourceMappingURL=index.js.map