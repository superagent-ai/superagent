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

// src/input.tsx
var input_exports = {};
__export(input_exports, {
  Input: () => Input
});
module.exports = __toCommonJS(input_exports);
var import_form_control = require("@chakra-ui/form-control");
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_jsx_runtime = require("react/jsx-runtime");
var Input = (0, import_system.forwardRef)(function Input2(props, ref) {
  const { htmlSize, ...rest } = props;
  const styles = (0, import_system.useMultiStyleConfig)("Input", rest);
  const ownProps = (0, import_system.omitThemingProps)(rest);
  const input = (0, import_form_control.useFormControl)(ownProps);
  const _className = (0, import_shared_utils.cx)("chakra-input", props.className);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.input,
    {
      size: htmlSize,
      ...input,
      __css: styles.field,
      ref,
      className: _className
    }
  );
});
Input.displayName = "Input";
Input.id = "Input";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Input
});
//# sourceMappingURL=input.js.map