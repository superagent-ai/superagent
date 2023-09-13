'use client'
import {
  usePopoverContext
} from "./chunk-Z3POGKNI.mjs";

// src/popover-anchor.tsx
import { Children, cloneElement } from "react";
function PopoverAnchor(props) {
  const child = Children.only(props.children);
  const { getAnchorProps } = usePopoverContext();
  return cloneElement(child, getAnchorProps(child.props, child.ref));
}
PopoverAnchor.displayName = "PopoverAnchor";

export {
  PopoverAnchor
};
//# sourceMappingURL=chunk-DY5QRMBO.mjs.map