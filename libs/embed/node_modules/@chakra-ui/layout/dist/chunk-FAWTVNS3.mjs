'use client'

// src/center.tsx
import { chakra, forwardRef } from "@chakra-ui/system";
import { jsx } from "react/jsx-runtime";
var Center = chakra("div", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
Center.displayName = "Center";
var centerStyles = {
  horizontal: {
    insetStart: "50%",
    transform: "translateX(-50%)"
  },
  vertical: {
    top: "50%",
    transform: "translateY(-50%)"
  },
  both: {
    insetStart: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  }
};
var AbsoluteCenter = forwardRef(
  function AbsoluteCenter2(props, ref) {
    const { axis = "both", ...rest } = props;
    return /* @__PURE__ */ jsx(
      chakra.div,
      {
        ref,
        __css: centerStyles[axis],
        ...rest,
        position: "absolute"
      }
    );
  }
);

export {
  Center,
  AbsoluteCenter
};
//# sourceMappingURL=chunk-FAWTVNS3.mjs.map