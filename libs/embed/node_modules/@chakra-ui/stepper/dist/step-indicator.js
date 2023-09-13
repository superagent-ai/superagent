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

// src/step-indicator.tsx
var step_indicator_exports = {};
__export(step_indicator_exports, {
  StepIndicator: () => StepIndicator,
  StepIndicatorContent: () => StepIndicatorContent
});
module.exports = __toCommonJS(step_indicator_exports);
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_system3 = require("@chakra-ui/system");

// src/step-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");

// src/step-icon.tsx
var import_icon = require("@chakra-ui/icon");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function CheckIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0",
      viewBox: "0 0 20 20",
      "aria-hidden": "true",
      height: "1em",
      width: "1em",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "path",
        {
          fillRule: "evenodd",
          d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
          clipRule: "evenodd"
        }
      )
    }
  );
}

// src/step-icon.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function StepIcon(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  const icon = status === "complete" ? CheckIcon : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_icon.Icon,
    {
      as: icon,
      __css: styles.icon,
      ...props,
      className: (0, import_shared_utils.cx)("chakra-step__icon", props.className)
    }
  );
}

// src/step-number.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");
var import_jsx_runtime3 = require("react/jsx-runtime");
var StepNumber = (0, import_system2.forwardRef)(function StepNumber2(props, ref) {
  const { children, ...restProps } = props;
  const { status, index } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_system2.chakra.div,
    {
      ref,
      "data-status": status,
      __css: styles.number,
      ...restProps,
      className: (0, import_shared_utils2.cx)("chakra-step__number", props.className),
      children: children || index + 1
    }
  );
});

// src/step-status.tsx
var import_shared_utils3 = require("@chakra-ui/shared-utils");
var import_jsx_runtime4 = require("react/jsx-runtime");
function StepStatus(props) {
  const { complete, incomplete, active } = props;
  const context = useStepContext();
  let render = null;
  switch (context.status) {
    case "complete":
      render = (0, import_shared_utils3.runIfFn)(complete, context);
      break;
    case "incomplete":
      render = (0, import_shared_utils3.runIfFn)(incomplete, context);
      break;
    case "active":
      render = (0, import_shared_utils3.runIfFn)(active, context);
      break;
  }
  return render ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: render }) : null;
}

// src/step-indicator.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function StepIndicator(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_system3.chakra.div,
    {
      "data-status": status,
      ...props,
      __css: styles.indicator,
      className: (0, import_shared_utils4.cx)("chakra-step__indicator", props.className)
    }
  );
}
function StepIndicatorContent() {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    StepStatus,
    {
      complete: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StepIcon, {}),
      incomplete: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StepNumber, {}),
      active: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StepNumber, {})
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StepIndicator,
  StepIndicatorContent
});
//# sourceMappingURL=step-indicator.js.map