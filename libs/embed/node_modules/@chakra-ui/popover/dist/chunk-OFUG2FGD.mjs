'use client'
import {
  usePopoverContext
} from "./chunk-Z3POGKNI.mjs";

// src/popover-trigger.tsx
import { Children, cloneElement } from "react";
function PopoverTrigger(props) {
  const child = Children.only(props.children);
  const { getTriggerProps } = usePopoverContext();
  return cloneElement(child, getTriggerProps(child.props, child.ref));
}
PopoverTrigger.displayName = "PopoverTrigger";

export {
  PopoverTrigger
};
//# sourceMappingURL=chunk-OFUG2FGD.mjs.map