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

// src/should-forward-prop.ts
var should_forward_prop_exports = {};
__export(should_forward_prop_exports, {
  shouldForwardProp: () => shouldForwardProp
});
module.exports = __toCommonJS(should_forward_prop_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  shouldForwardProp
});
//# sourceMappingURL=should-forward-prop.js.map