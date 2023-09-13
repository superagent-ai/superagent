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

// src/heading.tsx
var heading_exports = {};
__export(heading_exports, {
  Heading: () => Heading
});
module.exports = __toCommonJS(heading_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Heading = (0, import_system.forwardRef)(function Heading2(props, ref) {
  const styles = (0, import_system.useStyleConfig)("Heading", props);
  const { className, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.h2,
    {
      ref,
      className: (0, import_shared_utils.cx)("chakra-heading", props.className),
      ...rest,
      __css: styles
    }
  );
});
Heading.displayName = "Heading";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Heading
});
//# sourceMappingURL=heading.js.map