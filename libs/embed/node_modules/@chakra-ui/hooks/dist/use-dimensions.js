"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-dimensions.ts
var use_dimensions_exports = {};
__export(use_dimensions_exports, {
  useDimensions: () => useDimensions
});
module.exports = __toCommonJS(use_dimensions_exports);
var import_utils2 = require("@chakra-ui/utils");
var import_react2 = require("react");

// src/use-safe-layout-effect.ts
var import_utils = require("@chakra-ui/utils");
var import_react = require("react");
var useSafeLayoutEffect = import_utils.isBrowser ? import_react.useLayoutEffect : import_react.useEffect;

// src/use-dimensions.ts
function useDimensions(ref, observe) {
  const [dimensions, setDimensions] = (0, import_react2.useState)(null);
  const rafId = (0, import_react2.useRef)();
  useSafeLayoutEffect(() => {
    function measure() {
      const node = ref.current;
      if (!node)
        return;
      rafId.current = requestAnimationFrame(() => {
        const boxModel = (0, import_utils2.getBox)(node);
        setDimensions(boxModel);
      });
    }
    measure();
    if (observe) {
      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure);
    }
    return () => {
      if (observe) {
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [observe]);
  return dimensions;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDimensions
});
