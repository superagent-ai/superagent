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

// src/code.tsx
var code_exports = {};
__export(code_exports, {
  Code: () => Code
});
module.exports = __toCommonJS(code_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Code = (0, import_system.forwardRef)(function Code2(props, ref) {
  const styles = (0, import_system.useStyleConfig)("Code", props);
  const { className, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.code,
    {
      ref,
      className: (0, import_shared_utils.cx)("chakra-code", props.className),
      ...rest,
      __css: {
        display: "inline-block",
        ...styles
      }
    }
  );
});
Code.displayName = "Code";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Code
});
//# sourceMappingURL=code.js.map