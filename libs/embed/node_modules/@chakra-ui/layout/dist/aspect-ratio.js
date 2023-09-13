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

// src/aspect-ratio.tsx
var aspect_ratio_exports = {};
__export(aspect_ratio_exports, {
  AspectRatio: () => AspectRatio
});
module.exports = __toCommonJS(aspect_ratio_exports);
var import_system = require("@chakra-ui/system");
var import_breakpoint_utils = require("@chakra-ui/breakpoint-utils");
var import_shared_utils = require("@chakra-ui/shared-utils");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var AspectRatio = (0, import_system.forwardRef)(function(props, ref) {
  const { ratio = 4 / 3, children, className, ...rest } = props;
  const child = import_react.Children.only(children);
  const _className = (0, import_shared_utils.cx)("chakra-aspect-ratio", className);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_system.chakra.div,
    {
      ref,
      position: "relative",
      className: _className,
      _before: {
        height: 0,
        content: `""`,
        display: "block",
        paddingBottom: (0, import_breakpoint_utils.mapResponsive)(ratio, (r) => `${1 / r * 100}%`)
      },
      __css: {
        "& > *:not(style)": {
          overflow: "hidden",
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        },
        "& > img, & > video": {
          objectFit: "cover"
        }
      },
      ...rest,
      children: child
    }
  );
});
AspectRatio.displayName = "AspectRatio";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AspectRatio
});
//# sourceMappingURL=aspect-ratio.js.map