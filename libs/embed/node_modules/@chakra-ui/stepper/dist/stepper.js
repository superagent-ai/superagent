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

// src/stepper.tsx
var stepper_exports = {};
__export(stepper_exports, {
  Stepper: () => Stepper
});
module.exports = __toCommonJS(stepper_exports);
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");
var import_react = require("react");

// src/step-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");

// src/stepper.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Stepper = (0, import_system2.forwardRef)(function Stepper2(props, ref) {
  const styles = (0, import_system2.useMultiStyleConfig)("Stepper", props);
  const {
    children,
    index,
    orientation = "horizontal",
    showLastSeparator = false,
    ...restProps
  } = (0, import_system2.omitThemingProps)(props);
  const stepElements = import_react.Children.toArray(children);
  const stepCount = stepElements.length;
  function getStatus(step) {
    if (step < index)
      return "complete";
    if (step > index)
      return "incomplete";
    return "active";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.div,
    {
      ref,
      "aria-label": "Progress",
      "data-orientation": orientation,
      ...restProps,
      __css: styles.stepper,
      className: (0, import_shared_utils.cx)("chakra-stepper", props.className),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepperStylesProvider, { value: styles, children: stepElements.map((child, index2) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        StepContextProvider,
        {
          value: {
            index: index2,
            status: getStatus(index2),
            orientation,
            showLastSeparator,
            count: stepCount,
            isFirst: index2 === 0,
            isLast: index2 === stepCount - 1
          },
          children: child
        },
        index2
      )) })
    }
  );
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Stepper
});
//# sourceMappingURL=stepper.js.map