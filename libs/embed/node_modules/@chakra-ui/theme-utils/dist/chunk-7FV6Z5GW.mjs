import {
  mergeThemeOverride
} from "./chunk-LIR5QAZY.mjs";

// src/theme-extensions/with-default-color-scheme.ts
import { isObject } from "@chakra-ui/shared-utils";
function withDefaultColorScheme({
  colorScheme,
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
          const withColorScheme = {
            defaultProps: {
              colorScheme
            }
          };
          return [componentName, withColorScheme];
        })
      )
    });
  };
}

export {
  withDefaultColorScheme
};
