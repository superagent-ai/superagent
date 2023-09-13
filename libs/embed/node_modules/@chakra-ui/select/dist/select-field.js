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

// src/select-field.tsx
var select_field_exports = {};
__export(select_field_exports, {
  SelectField: () => SelectField
});
module.exports = __toCommonJS(select_field_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var SelectField = (0, import_system.forwardRef)(
  function SelectField2(props, ref) {
    const { children, placeholder, className, ...rest } = props;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_system.chakra.select,
      {
        ...rest,
        ref,
        className: (0, import_shared_utils.cx)("chakra-select", className),
        children: [
          placeholder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: placeholder }),
          children
        ]
      }
    );
  }
);
SelectField.displayName = "SelectField";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SelectField
});
//# sourceMappingURL=select-field.js.map