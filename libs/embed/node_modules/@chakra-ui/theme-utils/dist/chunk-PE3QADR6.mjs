import {
  withDefaultColorScheme
} from "./chunk-7FV6Z5GW.mjs";
import {
  withDefaultSize
} from "./chunk-5IM46G4H.mjs";
import {
  withDefaultVariant
} from "./chunk-5UFXUR4J.mjs";
import {
  mergeThemeOverride
} from "./chunk-LIR5QAZY.mjs";

// src/theme-extensions/with-default-props.ts
function pipe(...fns) {
  return (v) => fns.reduce((a, b) => b(a), v);
}
function withDefaultProps({
  defaultProps: { colorScheme, variant, size },
  components
}) {
  const identity = (t) => t;
  const fns = [
    colorScheme ? withDefaultColorScheme({ colorScheme, components }) : identity,
    size ? withDefaultSize({ size, components }) : identity,
    variant ? withDefaultVariant({ variant, components }) : identity
  ];
  return (theme) => mergeThemeOverride(pipe(...fns)(theme));
}

export {
  withDefaultProps
};
