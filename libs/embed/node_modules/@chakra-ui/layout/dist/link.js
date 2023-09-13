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

// src/link.tsx
var link_exports = {};
__export(link_exports, {
  Link: () => Link
});
module.exports = __toCommonJS(link_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Link = (0, import_system.forwardRef)(function Link2(props, ref) {
  const styles = (0, import_system.useStyleConfig)("Link", props);
  const { className, isExternal, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.a,
    {
      target: isExternal ? "_blank" : void 0,
      rel: isExternal ? "noopener" : void 0,
      ref,
      className: (0, import_shared_utils.cx)("chakra-link", className),
      ...rest,
      __css: styles
    }
  );
});
Link.displayName = "Link";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Link
});
//# sourceMappingURL=link.js.map