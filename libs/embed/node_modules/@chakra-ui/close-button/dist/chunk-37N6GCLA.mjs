'use client'

// src/close-button.tsx
import { Icon } from "@chakra-ui/icon";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useStyleConfig
} from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
function CloseIcon(props) {
  return /* @__PURE__ */ jsx(Icon, { focusable: "false", "aria-hidden": true, ...props, children: /* @__PURE__ */ jsx(
    "path",
    {
      fill: "currentColor",
      d: "M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"
    }
  ) });
}
var CloseButton = forwardRef(
  function CloseButton2(props, ref) {
    const styles = useStyleConfig("CloseButton", props);
    const { children, isDisabled, __css, ...rest } = omitThemingProps(props);
    const baseStyle = {
      outline: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    };
    return /* @__PURE__ */ jsx(
      chakra.button,
      {
        type: "button",
        "aria-label": "Close",
        ref,
        disabled: isDisabled,
        __css: {
          ...baseStyle,
          ...styles,
          ...__css
        },
        ...rest,
        children: children || /* @__PURE__ */ jsx(CloseIcon, { width: "1em", height: "1em" })
      }
    );
  }
);
CloseButton.displayName = "CloseButton";

export {
  CloseButton
};
//# sourceMappingURL=chunk-37N6GCLA.mjs.map