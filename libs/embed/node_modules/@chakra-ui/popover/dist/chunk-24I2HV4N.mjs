'use client'
import {
  PopoverTransition
} from "./chunk-F4GPNG57.mjs";
import {
  usePopoverContext,
  usePopoverStyles
} from "./chunk-Z3POGKNI.mjs";

// src/popover-content.tsx
import { callAll, cx } from "@chakra-ui/shared-utils";
import {
  chakra,
  forwardRef
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var PopoverContent = forwardRef(
  function PopoverContent2(props, ref) {
    const { rootProps, motionProps, ...contentProps } = props;
    const { getPopoverProps, getPopoverPositionerProps, onAnimationComplete } = usePopoverContext();
    const styles = usePopoverStyles();
    const contentStyles = {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      ...styles.content
    };
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ...getPopoverPositionerProps(rootProps),
        __css: styles.popper,
        className: "chakra-popover__popper",
        children: /* @__PURE__ */ jsx(
          PopoverTransition,
          {
            ...motionProps,
            ...getPopoverProps(contentProps, ref),
            onAnimationComplete: callAll(
              onAnimationComplete,
              contentProps.onAnimationComplete
            ),
            className: cx("chakra-popover__content", props.className),
            __css: contentStyles
          }
        )
      }
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export {
  PopoverContent
};
//# sourceMappingURL=chunk-24I2HV4N.mjs.map