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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Step: () => Step,
  StepDescription: () => StepDescription,
  StepIcon: () => StepIcon,
  StepIndicator: () => StepIndicator,
  StepIndicatorContent: () => StepIndicatorContent,
  StepNumber: () => StepNumber,
  StepSeparator: () => StepSeparator,
  StepStatus: () => StepStatus,
  StepTitle: () => StepTitle,
  Stepper: () => Stepper,
  useStepContext: () => useStepContext,
  useStepperStyles: () => useStepperStyles,
  useSteps: () => useSteps
});
module.exports = __toCommonJS(src_exports);

// src/step.tsx
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_system2 = require("@chakra-ui/system");

// src/step-context.tsx
var import_react_context = require("@chakra-ui/react-context");
var import_system = require("@chakra-ui/system");
var [StepContextProvider, useStepContext] = (0, import_react_context.createContext)(
  { name: "StepContext" }
);
var [StepperStylesProvider, useStepperStyles] = (0, import_system.createStylesContext)("Stepper");

// src/step.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Step = (0, import_system2.forwardRef)(function Step2(props, ref) {
  const { orientation, status, showLastSeparator } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system2.chakra.div,
    {
      ref,
      "data-status": status,
      "data-orientation": orientation,
      "data-stretch": (0, import_shared_utils.dataAttr)(showLastSeparator),
      __css: styles.step,
      ...props,
      className: (0, import_shared_utils.cx)("chakra-step", props.className)
    }
  );
});

// src/step-description.tsx
var import_shared_utils2 = require("@chakra-ui/shared-utils");
var import_system3 = require("@chakra-ui/system");
var import_jsx_runtime2 = require("react/jsx-runtime");
var StepDescription = (0, import_system3.forwardRef)(function StepDescription2(props, ref) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_system3.chakra.p,
    {
      ref,
      "data-status": status,
      ...props,
      className: (0, import_shared_utils2.cx)("chakra-step__description", props.className),
      __css: styles.description
    }
  );
});

// src/step-icon.tsx
var import_icon = require("@chakra-ui/icon");
var import_shared_utils3 = require("@chakra-ui/shared-utils");

// src/icons.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function CheckIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_jsx_runtime4 = require("react/jsx-runtime");
function StepIcon(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  const icon = status === "complete" ? CheckIcon : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_icon.Icon,
    {
      as: icon,
      __css: styles.icon,
      ...props,
      className: (0, import_shared_utils3.cx)("chakra-step__icon", props.className)
    }
  );
}

// src/step-indicator.tsx
var import_shared_utils6 = require("@chakra-ui/shared-utils");
var import_system5 = require("@chakra-ui/system");

// src/step-number.tsx
var import_shared_utils4 = require("@chakra-ui/shared-utils");
var import_system4 = require("@chakra-ui/system");
var import_jsx_runtime5 = require("react/jsx-runtime");
var StepNumber = (0, import_system4.forwardRef)(function StepNumber2(props, ref) {
  const { children, ...restProps } = props;
  const { status, index } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_system4.chakra.div,
    {
      ref,
      "data-status": status,
      __css: styles.number,
      ...restProps,
      className: (0, import_shared_utils4.cx)("chakra-step__number", props.className),
      children: children || index + 1
    }
  );
});

// src/step-status.tsx
var import_shared_utils5 = require("@chakra-ui/shared-utils");
var import_jsx_runtime6 = require("react/jsx-runtime");
function StepStatus(props) {
  const { complete, incomplete, active } = props;
  const context = useStepContext();
  let render = null;
  switch (context.status) {
    case "complete":
      render = (0, import_shared_utils5.runIfFn)(complete, context);
      break;
    case "incomplete":
      render = (0, import_shared_utils5.runIfFn)(incomplete, context);
      break;
    case "active":
      render = (0, import_shared_utils5.runIfFn)(active, context);
      break;
  }
  return render ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: render }) : null;
}

// src/step-indicator.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function StepIndicator(props) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_system5.chakra.div,
    {
      "data-status": status,
      ...props,
      __css: styles.indicator,
      className: (0, import_shared_utils6.cx)("chakra-step__indicator", props.className)
    }
  );
}
function StepIndicatorContent() {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    StepStatus,
    {
      complete: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StepIcon, {}),
      incomplete: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StepNumber, {}),
      active: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StepNumber, {})
    }
  );
}

// src/step-separator.tsx
var import_shared_utils7 = require("@chakra-ui/shared-utils");
var import_system6 = require("@chakra-ui/system");
var import_jsx_runtime8 = require("react/jsx-runtime");
var StepSeparator = (0, import_system6.forwardRef)(function StepSeparator2(props, ref) {
  const { orientation, status, isLast, showLastSeparator } = useStepContext();
  const styles = useStepperStyles();
  if (isLast && !showLastSeparator)
    return null;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_system6.chakra.div,
    {
      ref,
      role: "separator",
      "data-orientation": orientation,
      "data-status": status,
      __css: styles.separator,
      ...props,
      className: (0, import_shared_utils7.cx)("chakra-step__separator", props.className)
    }
  );
});

// src/step-title.tsx
var import_shared_utils8 = require("@chakra-ui/shared-utils");
var import_system7 = require("@chakra-ui/system");
var import_jsx_runtime9 = require("react/jsx-runtime");
var StepTitle = (0, import_system7.forwardRef)(function StepTitle2(props, ref) {
  const { status } = useStepContext();
  const styles = useStepperStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    import_system7.chakra.h3,
    {
      ref,
      "data-status": status,
      ...props,
      __css: styles.title,
      className: (0, import_shared_utils8.cx)("chakra-step__title", props.className)
    }
  );
});

// src/stepper.tsx
var import_shared_utils9 = require("@chakra-ui/shared-utils");
var import_system8 = require("@chakra-ui/system");
var import_react = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var Stepper = (0, import_system8.forwardRef)(function Stepper2(props, ref) {
  const styles = (0, import_system8.useMultiStyleConfig)("Stepper", props);
  const {
    children,
    index,
    orientation = "horizontal",
    showLastSeparator = false,
    ...restProps
  } = (0, import_system8.omitThemingProps)(props);
  const stepElements = import_react.Children.toArray(children);
  const stepCount = stepElements.length;
  function getStatus(step) {
    if (step < index)
      return "complete";
    if (step > index)
      return "incomplete";
    return "active";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    import_system8.chakra.div,
    {
      ref,
      "aria-label": "Progress",
      "data-orientation": orientation,
      ...restProps,
      __css: styles.stepper,
      className: (0, import_shared_utils9.cx)("chakra-stepper", props.className),
      children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(StepperStylesProvider, { value: styles, children: stepElements.map((child, index2) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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

// src/use-steps.ts
var import_react2 = require("react");
function useSteps(props = {}) {
  const { index = 0, count } = props;
  const [activeStep, setActiveStep] = (0, import_react2.useState)(index);
  const maxStep = typeof count === "number" ? count - 1 : 0;
  const activeStepPercent = activeStep / maxStep;
  return {
    activeStep,
    setActiveStep,
    activeStepPercent,
    isActiveStep(step) {
      return step === activeStep;
    },
    isCompleteStep(step) {
      return step < activeStep;
    },
    isIncompleteStep(step) {
      return step > activeStep;
    },
    getStatus(step) {
      if (step < activeStep)
        return "complete";
      if (step > activeStep)
        return "incomplete";
      return "active";
    },
    goToNext() {
      setActiveStep((step) => {
        return typeof count === "number" ? Math.min(count, step + 1) : step + 1;
      });
    },
    goToPrevious() {
      setActiveStep((step) => Math.max(0, step - 1));
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepIndicatorContent,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useStepContext,
  useStepperStyles,
  useSteps
});
//# sourceMappingURL=index.js.map