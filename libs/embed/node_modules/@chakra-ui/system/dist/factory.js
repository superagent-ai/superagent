'use client'
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/factory.ts
var factory_exports = {};
__export(factory_exports, {
  chakra: () => chakra
});
module.exports = __toCommonJS(factory_exports);

// src/system.ts
var import_color_mode = require("@chakra-ui/color-mode");
var import_styled_system2 = require("@chakra-ui/styled-system");
var import_utils = require("@chakra-ui/utils");
var import_object_utils = require("@chakra-ui/object-utils");
var import_styled = __toESM(require("@emotion/styled"));
var import_react = __toESM(require("react"));

// src/should-forward-prop.ts
var import_styled_system = require("@chakra-ui/styled-system");
var allPropNames = /* @__PURE__ */ new Set([
  ...import_styled_system.propNames,
  "textStyle",
  "layerStyle",
  "apply",
  "noOfLines",
  "focusBorderColor",
  "errorBorderColor",
  "as",
  "__css",
  "css",
  "sx"
]);
var validHTMLProps = /* @__PURE__ */ new Set([
  "htmlWidth",
  "htmlHeight",
  "htmlSize",
  "htmlTranslate"
]);
function shouldForwardProp(prop) {
  return validHTMLProps.has(prop) || !allPropNames.has(prop);
}

// src/system.ts
var _a;
var emotion_styled = (_a = import_styled.default.default) != null ? _a : import_styled.default;
var toCSSObject = ({ baseStyle }) => (props) => {
  const { theme, css: cssProp, __css, sx, ...rest } = props;
  const styleProps = (0, import_utils.objectFilter)(rest, (_, prop) => (0, import_styled_system2.isStyleProp)(prop));
  const finalBaseStyle = (0, import_utils.runIfFn)(baseStyle, props);
  const finalStyles = (0, import_object_utils.assignAfter)(
    {},
    __css,
    finalBaseStyle,
    (0, import_utils.filterUndefined)(styleProps),
    sx
  );
  const computedCSS = (0, import_styled_system2.css)(finalStyles)(props.theme);
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
  const chakraComponent = import_react.default.forwardRef(function ChakraComponent(props, ref) {
    const { colorMode, forced } = (0, import_color_mode.useColorMode)();
    return import_react.default.createElement(Component, {
      ref,
      "data-theme": forced ? colorMode : void 0,
      ...props
    });
  });
  return chakraComponent;
}

// src/factory.ts
function factory() {
  const cache = /* @__PURE__ */ new Map();
  return new Proxy(styled, {
    /**
     * @example
     * const Div = chakra("div")
     * const WithChakra = chakra(AnotherComponent)
     */
    apply(target, thisArg, argArray) {
      return styled(...argArray);
    },
    /**
     * @example
     * <chakra.div />
     */
    get(_, element) {
      if (!cache.has(element)) {
        cache.set(element, styled(element));
      }
      return cache.get(element);
    }
  });
}
var chakra = factory();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  chakra
});
//# sourceMappingURL=factory.js.map