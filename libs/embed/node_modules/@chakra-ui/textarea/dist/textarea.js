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

// src/textarea.tsx
var textarea_exports = {};
__export(textarea_exports, {
  Textarea: () => Textarea
});
module.exports = __toCommonJS(textarea_exports);
var import_form_control = require("@chakra-ui/form-control");
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// ../../utilities/object-utils/src/omit.ts
function omit(object, keysToOmit = []) {
  const clone = Object.assign({}, object);
  for (const key of keysToOmit) {
    if (key in clone) {
      delete clone[key];
    }
  }
  return clone;
}

// src/textarea.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var omitted = ["h", "minH", "height", "minHeight"];
var Textarea = (0, import_system.forwardRef)((props, ref) => {
  const styles = (0, import_system.useStyleConfig)("Textarea", props);
  const { className, rows, ...rest } = (0, import_system.omitThemingProps)(props);
  const textareaProps = (0, import_form_control.useFormControl)(rest);
  const textareaStyles = rows ? omit(styles, omitted) : styles;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.textarea,
    {
      ref,
      rows,
      ...textareaProps,
      className: (0, import_shared_utils.cx)("chakra-textarea", className),
      __css: textareaStyles
    }
  );
});
Textarea.displayName = "Textarea";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Textarea
});
//# sourceMappingURL=textarea.js.map