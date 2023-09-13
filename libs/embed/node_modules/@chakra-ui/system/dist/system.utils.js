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

// src/system.utils.ts
var system_utils_exports = {};
__export(system_utils_exports, {
  default: () => isTag,
  getDisplayName: () => getDisplayName
});
module.exports = __toCommonJS(system_utils_exports);
var import_utils = require("@chakra-ui/utils");
function isTag(target) {
  return (0, import_utils.isString)(target) && (import_utils.__DEV__ ? target.charAt(0) === target.charAt(0).toLowerCase() : true);
}
function getDisplayName(primitive) {
  return isTag(primitive) ? `chakra.${primitive}` : getComponentName(primitive);
}
function getComponentName(primitive) {
  return (import_utils.__DEV__ ? (0, import_utils.isString)(primitive) && primitive : false) || !(0, import_utils.isString)(primitive) && primitive.displayName || !(0, import_utils.isString)(primitive) && primitive.name || "ChakraComponent";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDisplayName
});
//# sourceMappingURL=system.utils.js.map