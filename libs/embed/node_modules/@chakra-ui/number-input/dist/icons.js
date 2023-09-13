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

// src/icons.tsx
var icons_exports = {};
__export(icons_exports, {
  TriangleDownIcon: () => TriangleDownIcon,
  TriangleUpIcon: () => TriangleUpIcon
});
module.exports = __toCommonJS(icons_exports);
var import_icon = require("@chakra-ui/icon");
var import_jsx_runtime = require("react/jsx-runtime");
var TriangleDownIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"
  }
) });
var TriangleUpIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.Icon, { viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "path",
  {
    fill: "currentColor",
    d: "M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"
  }
) });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TriangleDownIcon,
  TriangleUpIcon
});
//# sourceMappingURL=icons.js.map