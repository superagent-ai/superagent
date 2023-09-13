'use client'

// src/circular-progress-label.tsx
import { chakra } from "@chakra-ui/system";
var CircularProgressLabel = chakra("div", {
  baseStyle: {
    fontSize: "0.24em",
    top: "50%",
    left: "50%",
    width: "100%",
    textAlign: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)"
  }
});
CircularProgressLabel.displayName = "CircularProgressLabel";

export {
  CircularProgressLabel
};
//# sourceMappingURL=chunk-QQ2FLD7A.mjs.map