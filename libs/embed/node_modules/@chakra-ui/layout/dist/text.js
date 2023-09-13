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

// src/text.tsx
var text_exports = {};
__export(text_exports, {
  Text: () => Text
});
module.exports = __toCommonJS(text_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_object_utils = require("@chakra-ui/object-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Text = (0, import_system.forwardRef)(function Text2(props, ref) {
  const styles = (0, import_system.useStyleConfig)("Text", props);
  const { className, align, decoration, casing, ...rest } = (0, import_system.omitThemingProps)(props);
  const aliasedProps = (0, import_object_utils.compact)({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.p,
    {
      ref,
      className: (0, import_shared_utils.cx)("chakra-text", props.className),
      ...aliasedProps,
      ...rest,
      __css: styles
    }
  );
});
Text.displayName = "Text";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Text
});
//# sourceMappingURL=text.js.map