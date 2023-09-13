'use client'
import {
  useAccordionItemContext,
  useAccordionStyles
} from "./chunk-RUEU7BLR.mjs";

// src/accordion-button.tsx
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var AccordionButton = forwardRef(
  function AccordionButton2(props, ref) {
    const { getButtonProps } = useAccordionItemContext();
    const buttonProps = getButtonProps(props, ref);
    const styles = useAccordionStyles();
    const buttonStyles = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      outline: 0,
      ...styles.button
    };
    return /* @__PURE__ */ jsx(
      chakra.button,
      {
        ...buttonProps,
        className: cx("chakra-accordion__button", props.className),
        __css: buttonStyles
      }
    );
  }
);
AccordionButton.displayName = "AccordionButton";

export {
  AccordionButton
};
//# sourceMappingURL=chunk-QCAXGLVH.mjs.map