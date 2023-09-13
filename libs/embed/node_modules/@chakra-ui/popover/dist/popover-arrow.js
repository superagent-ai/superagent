'use client'
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

// src/popover-arrow.tsx
var popover_arrow_exports = {};
__export(popover_arrow_exports, {
  PopoverArrow: () => PopoverArrow
});
module.exports = __toCommonJS(popover_arrow_exports);
var import_system = require("@chakra-ui/system");
var import_shared_utils = require("@chakra-ui/shared-utils");

// src/popover-context.ts
var import_react_context = require("@chakra-ui/react-context");
var [PopoverProvider, usePopoverContext] = (0, import_react_context.createContext)({
  name: "PopoverContext",
  errorMessage: "usePopoverContext: `context` is undefined. Seems you forgot to wrap all popover components within `<Popover />`"
});
var [PopoverStylesProvider, usePopoverStyles] = (0, import_react_context.createContext)({
  name: `PopoverStylesContext`,
  errorMessage: `usePopoverStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Popover />" `
});

// src/popover-arrow.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var resolveVar = (scale, value) => value ? `${scale}.${value}, ${value}` : void 0;
function PopoverArrow(props) {
  var _a;
  const { bg, bgColor, backgroundColor, shadow, boxShadow, shadowColor } = props;
  const { getArrowProps, getArrowInnerProps } = usePopoverContext();
  const styles = usePopoverStyles();
  const arrowBg = (_a = bg != null ? bg : bgColor) != null ? _a : backgroundColor;
  const arrowShadow = shadow != null ? shadow : boxShadow;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ...getArrowProps(),
      className: "chakra-popover__arrow-positioner",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_system.chakra.div,
        {
          className: (0, import_shared_utils.cx)("chakra-popover__arrow", props.className),
          ...getArrowInnerProps(props),
          __css: {
            "--popper-arrow-shadow-color": resolveVar("colors", shadowColor),
            "--popper-arrow-bg": resolveVar("colors", arrowBg),
            "--popper-arrow-shadow": resolveVar("shadows", arrowShadow),
            ...styles.arrow
          }
        }
      )
    }
  );
}
PopoverArrow.displayName = "PopoverArrow";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PopoverArrow
});
//# sourceMappingURL=popover-arrow.js.map