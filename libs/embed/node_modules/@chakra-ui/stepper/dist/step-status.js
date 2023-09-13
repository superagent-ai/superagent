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

// src/step-status.tsx
var step_status_exports = {};
__export(step_status_exports, {
  StepStatus: () => StepStatus
});
module.exports = __toCommonJS(step_status_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/step-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");

// src/step-status.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function StepStatus(props) {
  const { complete, incomplete, active } = props;
  const context = useStepContext();
  let render = null;
  switch (context.status) {
    case "complete":
      render = (0, import_shared_utils.runIfFn)(complete, context);
      break;
    case "incomplete":
      render = (0, import_shared_utils.runIfFn)(incomplete, context);
      break;
    case "active":
      render = (0, import_shared_utils.runIfFn)(active, context);
      break;
  }
  return render ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: render }) : null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StepStatus
});
//# sourceMappingURL=step-status.js.map