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

// src/kbd.tsx
var kbd_exports = {};
__export(kbd_exports, {
  Kbd: () => Kbd
});
module.exports = __toCommonJS(kbd_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Kbd = (0, import_system.forwardRef)(function Kbd2(props, ref) {
  const styles = (0, import_system.useStyleConfig)("Kbd", props);
  const { className, ...rest } = (0, import_system.omitThemingProps)(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.kbd,
    {
      ref,
      className: (0, import_shared_utils.cx)("chakra-kbd", className),
      ...rest,
      __css: {
        fontFamily: "mono",
        ...styles
      }
    }
  );
});
Kbd.displayName = "Kbd";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Kbd
});
//# sourceMappingURL=kbd.js.map