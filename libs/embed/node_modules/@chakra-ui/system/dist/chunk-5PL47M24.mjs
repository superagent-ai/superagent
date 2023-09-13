'use client'
import {
  shouldForwardProp
} from "./chunk-FDQH4LQI.mjs";

// src/system.ts
import { useColorMode } from "@chakra-ui/color-mode";
import {
  css,
  isStyleProp
} from "@chakra-ui/styled-system";
import { filterUndefined, objectFilter, runIfFn } from "@chakra-ui/utils";
import { assignAfter } from "@chakra-ui/object-utils";
import createStyled from "@emotion/styled";
import React from "react";
var _a;
var emotion_styled = (_a = createStyled.default) != null ? _a : createStyled;
var toCSSObject = ({ baseStyle }) => (props) => {
  const { theme, css: cssProp, __css, sx, ...rest } = props;
  const styleProps = objectFilter(rest, (_, prop) => isStyleProp(prop));
  const finalBaseStyle = runIfFn(baseStyle, props);
  const finalStyles = assignAfter(
    {},
    __css,
    finalBaseStyle,
    filterUndefined(styleProps),
    sx
  );
  const computedCSS = css(finalStyles)(props.theme);
  return cssProp ? [computedCSS, cssProp] : computedCSS;
};
function styled(component, options) {
  const { baseStyle, ...styledOptions } = options != null ? options : {};
  if (!styledOptions.shouldForwardProp) {
    styledOptions.shouldForwardProp = shouldForwardProp;
  }
  const styleObject = toCSSObject({ baseStyle });
  const Component = emotion_styled(
    component,
    styledOptions
  )(styleObject);
  const chakraComponent = React.forwardRef(function ChakraComponent(props, ref) {
    const { colorMode, forced } = useColorMode();
    return React.createElement(Component, {
      ref,
      "data-theme": forced ? colorMode : void 0,
      ...props
    });
  });
  return chakraComponent;
}

export {
  toCSSObject,
  styled
};
//# sourceMappingURL=chunk-5PL47M24.mjs.map