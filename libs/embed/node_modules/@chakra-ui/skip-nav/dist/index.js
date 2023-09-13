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
  SkipNavContent: () => SkipNavContent,
  SkipNavLink: () => SkipNavLink
});
module.exports = __toCommonJS(src_exports);

// src/skip-nav.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var fallbackId = "chakra-skip-nav";
function getStyles(styles) {
  return {
    userSelect: "none",
    border: "0",
    height: "1px",
    width: "1px",
    margin: "-1px",
    padding: "0",
    outline: "0",
    overflow: "hidden",
    position: "absolute",
    clip: "rect(0 0 0 0)",
    ...styles,
    _focus: {
      clip: "auto",
      width: "auto",
      height: "auto",
      ...styles["_focus"]
    }
  };
}
var SkipNavLink = (0, import_system.forwardRef)(
  function SkipNavLink2(props, ref) {
    const styles = (0, import_system.useStyleConfig)("SkipLink", props);
    const { id = fallbackId, ...rest } = (0, import_system.omitThemingProps)(props);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_system.chakra.a, { ...rest, ref, href: `#${id}`, __css: getStyles(styles) });
  }
);
SkipNavLink.displayName = "SkipNavLink";
var SkipNavContent = (0, import_system.forwardRef)(
  function SkipNavContent2(props, ref) {
    const { id = fallbackId, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.div,
      {
        ref,
        id,
        tabIndex: -1,
        style: { outline: 0 },
        ...rest
      }
    );
  }
);
SkipNavContent.displayName = "SkipNavContent";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SkipNavContent,
  SkipNavLink
});
//# sourceMappingURL=index.js.map