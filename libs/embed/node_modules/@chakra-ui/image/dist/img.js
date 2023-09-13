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

// src/img.tsx
var img_exports = {};
__export(img_exports, {
  Img: () => Img
});
module.exports = __toCommonJS(img_exports);
var import_system2 = require("@chakra-ui/system");

// src/native-image.tsx
var import_system = require("@chakra-ui/system");
var import_jsx_runtime = require("react/jsx-runtime");
var NativeImage = (0, import_system.forwardRef)(function NativeImage2(props, ref) {
  const { htmlWidth, htmlHeight, alt, ...rest } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { width: htmlWidth, height: htmlHeight, ref, alt, ...rest });
});
NativeImage.displayName = "NativeImage";

// src/img.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Img = (0, import_system2.forwardRef)((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_system2.chakra.img, { ref, as: NativeImage, className: "chakra-image", ...props }));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Img
});
//# sourceMappingURL=img.js.map