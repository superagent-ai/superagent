import {
  mergeThemeOverride
} from "./chunk-LIR5QAZY.mjs";

// src/theme-extensions/with-default-variant.ts
import { isObject } from "@chakra-ui/shared-utils";
function withDefaultVariant({
  variant,
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
          const withVariant = {
            defaultProps: {
              variant
            }
          };
          return [componentName, withVariant];
        })
      )
    });
  };
}

export {
  withDefaultVariant
};
