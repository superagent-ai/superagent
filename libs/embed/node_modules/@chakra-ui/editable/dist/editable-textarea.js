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

// src/editable-textarea.tsx
var editable_textarea_exports = {};
__export(editable_textarea_exports, {
  EditableTextarea: () => EditableTextarea
});
module.exports = __toCommonJS(editable_textarea_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/editable-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [EditableStylesProvider, useEditableStyles] = (0, import_react_context.createContext)({
  name: `EditableStylesContext`,
  errorMessage: `useEditableStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Editable />" `
});
var [EditableProvider, useEditableContext] = (0, import_react_context.createContext)({
  name: "EditableContext",
  errorMessage: "useEditableContext: context is undefined. Seems you forgot to wrap the editable components in `<Editable />`"
});

// src/shared.ts
var commonStyles = {
  fontSize: "inherit",
  fontWeight: "inherit",
  textAlign: "inherit",
  bg: "transparent"
};

// src/editable-textarea.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var EditableTextarea = (0, import_system.forwardRef)(
  function EditableTextarea2(props, ref) {
    const { getTextareaProps } = useEditableContext();
    const styles = useEditableStyles();
    const textareaProps = getTextareaProps(props, ref);
    const _className = (0, import_shared_utils.cx)("chakra-editable__textarea", props.className);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_system.chakra.textarea,
      {
        ...textareaProps,
        __css: {
          outline: 0,
          ...commonStyles,
          ...styles.textarea
        },
        className: _className
      }
    );
  }
);
EditableTextarea.displayName = "EditableTextarea";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditableTextarea
});
//# sourceMappingURL=editable-textarea.js.map