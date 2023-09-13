'use client'
import {
  usePopoverStyles
} from "./chunk-Z3POGKNI.mjs";

// src/popover-footer.tsx
import { chakra } from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
function PopoverFooter(props) {
  const styles = usePopoverStyles();
  return /* @__PURE__ */ jsx(
    chakra.footer,
    {
      ...props,
      className: cx("chakra-popover__footer", props.className),
      __css: styles.footer
    }
  );
}
PopoverFooter.displayName = "PopoverFooter";

export {
  PopoverFooter
};
//# sourceMappingURL=chunk-R6BA5JLS.mjs.map