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

// src/step-separator.tsx
var step_separator_exports = {};
__export(step_separator_exports, {
  StepSeparator: () => StepSeparator
});
module.exports = __toCommonJS(step_separator_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

// src/step-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");

// src/step-separator.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var StepSeparator = (0, import_system2.forwardRef)(function StepSeparator2(props, ref) {
  const { orientation, status, isLast, showLastSeparator } = useStepContext();
  const styles = useStepperStyles();
  if (isLast && !showLastSeparator)
    return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.div,
    {
      ref,
      role: "separator",
      "data-orientation": orientation,
      "data-status": status,
      __css: styles.separator,
      ...props,
      className: (0, import_shared_utils.cx)("chakra-step__separator", props.className)
    }
  );
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StepSeparator
});
//# sourceMappingURL=step-separator.js.map