import {
  mergeThemeOverride
} from "./chunk-LIR5QAZY.mjs";

// src/theme-extensions/with-default-size.ts
import { isObject } from "@chakra-ui/shared-utils";
function withDefaultSize({
  size,
  components
}) {
  return (theme) => {
    let names = Object.keys(theme.components || {});
    if (Array.isArray(components)) {
      names = components;
    } else if (isObject(components)) {
      names = Object.keys(components);
    }
    return mergeThemeOverride(theme, {
      components: Object.fromEntries(
        names.map((componentName) => {
          const withSize = {
            defaultProps: {
              size
            }
          };
          return [componentName, withSize];
        })
      )
    });
  };
}

export {
  withDefaultSize
};
