'use client'
import {
  useStepContext
} from "./chunk-5JULEEQD.mjs";

// src/step-status.tsx
import { runIfFn } from "@chakra-ui/shared-utils";
import { Fragment, jsx } from "react/jsx-runtime";
function StepStatus(props) {
  const { complete, incomplete, active } = props;
  const context = useStepContext();
  let render = null;
  switch (context.status) {
    case "complete":
      render = runIfFn(complete, context);
      break;
    case "incomplete":
      render = runIfFn(incomplete, context);
      break;
    case "active":
      render = runIfFn(active, context);
      break;
  }
  return render ? /* @__PURE__ */ jsx(Fragment, { children: render }) : null;
}

export {
  StepStatus
};
//# sourceMappingURL=chunk-ZVCNMXD3.mjs.map