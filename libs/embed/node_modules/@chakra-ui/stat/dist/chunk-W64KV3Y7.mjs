'use client'

// src/stat.tsx
import { createContext } from "@chakra-ui/react-context";
import {
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig
} from "@chakra-ui/system";
import { cx } from "@chakra-ui/shared-utils";
import { jsx } from "react/jsx-runtime";
var [StatStylesProvider, useStatStyles] = createContext({
  name: `StatStylesContext`,
  errorMessage: `useStatStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Stat />" `
});
var Stat = forwardRef(function Stat2(props, ref) {
  const styles = useMultiStyleConfig("Stat", props);
  const statStyles = {
    position: "relative",
    flex: "1 1 0%",
    ...styles.container
  };
  const { className, children, ...rest } = omitThemingProps(props);
  return /* @__PURE__ */ jsx(StatStylesProvider, { value: styles, children: /* @__PURE__ */ jsx(
    chakra.div,
    {
      ref,
      ...rest,
      className: cx("chakra-stat", className),
      __css: statStyles,
      children: /* @__PURE__ */ jsx("dl", { children })
    }
  ) });
});
Stat.displayName = "Stat";

export {
  useStatStyles,
  Stat
};
//# sourceMappingURL=chunk-W64KV3Y7.mjs.map